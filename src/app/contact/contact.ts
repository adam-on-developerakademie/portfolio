import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DATA } from '../../services/data';

type ContactFieldName = 'name' | 'email' | 'message';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  myData = inject(DATA);
  fb = inject(FormBuilder);
  http = inject(HttpClient);

  // Tracks submission state for displaying success/error messages.
  submitted = false;
  // Tracks form submission success state for UX feedback.
  submissionSuccess = false;
  // Tracks error state when API-based sending fails.
  submissionError = false;
  // Tracks whether a request is currently in flight.
  isSubmitting = false;
  // Tracks backend availability based on health endpoint checks.
  backendAvailable = signal(true);
  // Stores a readable backend status hint for the user.
  backendStatusMessage = signal('');
  // Stores a readable API error message for failed send attempts.
  submissionErrorMessage = '';
  // Stores the current visual state of the submit button label.
  submitButtonState = signal<'idle' | 'sending' | 'success'>('idle');
  // Stores the currently focused field to render typing state visuals.
  focusedField = signal<ContactFieldName | null>(null);

  // Form definition with validation rules applied on blur event.
  contactForm = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
    email: this.fb.control('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
    message: this.fb.control('', { validators: [Validators.required, Validators.minLength(10)], updateOn: 'blur' }),
    privacy: this.fb.control(false, { validators: [Validators.requiredTrue] })
  });

  // Scrolls smoothly to the provided anchor element when available.
  goTo(elementId: HTMLElement) {
    if (elementId) {
      elementId.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Performs an initial backend health check when the component is created.
  ngOnInit() {
    void this.checkBackendHealth();
  }

  // Handles form submission with validation and feedback handling.
  async onSubmit() {
    if (!this.canSubmit()) return;
    this.prepareSubmission();
    await this.trySubmitContactForm();
  }

  // Verifies local form state and backend readiness before sending.
  private canSubmit(): boolean {
    if (!this.isFormValid()) return false;
    if (this.backendAvailable()) return true;
    this.handleBackendUnavailable();
    return false;
  }

  // Runs the request and maps success and failure states consistently.
  private async trySubmitContactForm() {
    try {
      await this.sendContactForm();
      this.handleSubmissionSuccess();
    } catch (error: unknown) {
      this.handleSubmissionFailure(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  // Calls the health endpoint and stores availability for submit handling.
  private async checkBackendHealth() {
    try {
      await firstValueFrom(this.http.get('/api/health'));
      this.backendAvailable.set(true);
      this.backendStatusMessage.set('');
    } catch {
      this.handleBackendUnavailable();
    }
  }

  // Applies a clear user-facing state when the backend cannot be reached.
  private handleBackendUnavailable() {
    this.backendAvailable.set(false);
    this.submissionError = true;
    this.backendStatusMessage.set('Backend is unavailable. Start API with npm run start:all.');
    this.submissionErrorMessage = this.backendStatusMessage();
  }

  // Prepares state flags before sending a contact request.
  private prepareSubmission() {
    this.submitted = true;
    this.submissionError = false;
    this.submissionErrorMessage = '';
    this.isSubmitting = true;
  }

  // Checks whether the form is valid before sending it.
  private isFormValid(): boolean {
    if (this.contactForm.valid) {
      return true;
    }
    this.contactForm.markAllAsTouched();
    this.markAllFieldsTouched();
    this.submissionError = true;
    this.submissionErrorMessage = '';
    return false;
  }

  // Sends the current form values to the contact endpoint.
  private async sendContactForm() {
    this.submitButtonState.set('sending');
    const payload = this.contactForm.getRawValue();
    await firstValueFrom(this.http.post('/api/contact', payload));
  }

  // Applies the success state and clears the form fields.
  private handleSubmissionSuccess() {
    this.submissionSuccess = true;
    this.submissionError = false;
    this.submissionErrorMessage = '';
    this.backendAvailable.set(true);
    this.backendStatusMessage.set('');
    this.contactForm.reset({ name: '', email: '', message: '', privacy: false });
    this.submitButtonState.set('success');
    this.hideSuccessAfterDelay();
    this.resetButtonLabelAfterDelay();
  }

  // Restores the error state after a failed send attempt.
  private handleSubmissionFailure(error: unknown) {
    this.submissionSuccess = false;
    this.submissionError = true;
    this.submissionErrorMessage = this.resolveSubmissionErrorMessage(error);
    this.submitButtonState.set('idle');
  }

  // Resolves a readable message from known HTTP and backend error payloads.
  private resolveSubmissionErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const apiMessage = this.readApiErrorPayload(error.error);
      return apiMessage || error.message || 'Request failed';
    }
    return 'Request failed';
  }

  // Extracts message/details from backend JSON payload when available.
  private readApiErrorPayload(payload: unknown): string {
    if (!payload || typeof payload !== 'object') return '';
    const data = payload as { message?: unknown; details?: unknown };
    const message = typeof data.message === 'string' ? data.message : '';
    const details = typeof data.details === 'string' ? data.details : '';
    if (message && details) return `${message}: ${details}`;
    return message || details;
  }

  // Marks every form field as touched to expose validation messages.
  private markAllFieldsTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  // Clears the success message after a short timeout window.
  private hideSuccessAfterDelay() {
    setTimeout(() => {
      this.submissionSuccess = false;
    }, 5000);
  }

  // Restores the default button label after the success state is visible briefly.
  private resetButtonLabelAfterDelay() {
    setTimeout(() => {
      this.submitButtonState.set('idle');
    }, 3000);
  }

  // Resolves the submit button label for the current language and state.
  getSubmitButtonLabel(): string {
    const button = this.myData.DATA.contact.form.button;
    const language = this.myData.DATA.language;
    const submitButtonState = this.submitButtonState();
    if (this.isSubmitting || submitButtonState === 'sending') return button.sending[language];
    if (submitButtonState === 'success') return button.success[language];
    return button.idle[language];
  }

  // Marks one field as focused to show typing visuals.
  setFocusedField(fieldName: ContactFieldName) {
    this.focusedField.set(fieldName);
  }

  // Clears focus state when the currently tracked field loses focus.
  clearFocusedField(fieldName: ContactFieldName) {
    if (this.focusedField() === fieldName) {
      this.focusedField.set(null);
    }
  }

  // Returns whether the requested field is currently focused.
  isFocused(fieldName: ContactFieldName): boolean {
    return this.focusedField() === fieldName;
  }

  // Returns whether a field has a non-empty value.
  hasValue(fieldName: ContactFieldName): boolean {
    const fieldValue = this.contactForm.get(fieldName)?.value;
    return String(fieldValue ?? '').trim().length > 0;
  }

  // Returns whether a field should show the done state icon.
  isDone(fieldName: ContactFieldName): boolean {
    const field = this.contactForm.get(fieldName);
    if (!field) return false;
    const interacted = field.dirty || field.touched;
    return field.valid && interacted && !this.isFocused(fieldName);
  }

  // Returns whether the floating label should be displayed.
  showFloatingLabel(fieldName: ContactFieldName): boolean {
    return this.isFocused(fieldName) || this.hasError(fieldName) || this.isDone(fieldName);
  }

  // Helper method to check if field has validation error and user interacted.
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Helper method to get specific error message for field validation.
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    const validation = this.myData.DATA.contact.form.validation;
    const language = this.myData.DATA.language;
    if (!field || !field.errors) return '';
    if (field.errors['required']) return validation.required[language];
    if (field.errors['minlength']) return `${validation.minlengthPrefix[language]}${field.errors['minlength'].requiredLength}${validation.minlengthSuffix[language]}`;
    if (field.errors['email']) return validation.email[language];
    return validation.invalid[language];
  }
}
