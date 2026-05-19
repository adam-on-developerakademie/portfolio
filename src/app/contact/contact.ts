import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  // Tracks submission state for displaying success/error messages.
  submitted = false;
  // Tracks form submission success state for UX feedback.
  submissionSuccess = false;

  // Form definition with validation rules applied on blur event.
  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)], { updateOn: 'blur' }],
    email: ['', [Validators.required, Validators.email], { updateOn: 'blur' }],
    message: ['', [Validators.required, Validators.minLength(10)], { updateOn: 'blur' }],
    privacy: [false, Validators.requiredTrue]
  });

  // Scrolls smoothly to the provided anchor element when available.
  goTo(elementId: HTMLElement) {
    if (elementId) {
      elementId.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handles form submission with validation and feedback handling.
  onSubmit() {
    if (this.contactForm.valid) {
      // Here you would send data to backend
      this.submitted = true;
      this.submissionSuccess = true;
      this.contactForm.reset();
      
      // Hide success message after 5 seconds.
      setTimeout(() => {
        this.submissionSuccess = false;
      }, 5000);
    } else {
      // Mark all fields as touched to show validation errors.
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper method to check if field has validation error and user interacted.
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Helper method to get specific error message for field validation.
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors) return '';
    if (field.errors['required']) return 'This field is required';
    if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['email']) return 'Please enter a valid email';
    return 'Invalid input';
  }
}
