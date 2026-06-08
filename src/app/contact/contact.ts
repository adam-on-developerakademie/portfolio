import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DATA } from '../../services/data';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
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
  // Stores the current visual state of the submit button label.
  submitButtonState = signal<'idle' | 'sending' | 'success'>('idle');

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

  // Handles form submission with validation and feedback handling.
  async onSubmit() {
    if (!this.isFormValid()) {
      return;
    }
    this.prepareSubmission();
    try {
      await this.sendContactForm();
      this.handleSubmissionSuccess();
    } catch {
      this.handleSubmissionFailure();
    } finally {
      this.isSubmitting = false;
    }
  }

  // Prepares state flags before sending a contact request.
  private prepareSubmission() {
    this.submitted = true;
    this.submissionError = false;
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
    this.contactForm.reset({ name: '', email: '', message: '', privacy: false });
    this.submitButtonState.set('success');
    this.hideSuccessAfterDelay();
    this.resetButtonLabelAfterDelay();
  }

  // Restores the error state after a failed send attempt.
  private handleSubmissionFailure() {
    this.submissionSuccess = false;
    this.submissionError = true;
    this.submitButtonState.set('idle');
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
