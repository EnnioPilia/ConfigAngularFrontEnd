import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../../../core/services/auth/auth.service';
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const registerData: RegisterRequest = {
      name: '',  // Tu peux étendre le formGroup et récupérer un vrai nom ici si besoin
      email: this.emailControl.value,
      password: this.passwordControl.value,
      // age, role si tu veux les ajouter dans le formulaire
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.loading = false;
        // Après inscription, rediriger vers login (ou afficher message)
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Une erreur est survenue, veuillez réessayer.';
      }
    });
  }
}
