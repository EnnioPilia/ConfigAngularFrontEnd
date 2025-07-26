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
  successMessage: string | null = null;  // <-- ajoute cette ligne


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      age: [, [Validators.min(0)]],
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
  get nomControl(): FormControl {
    return this.registerForm.get('nom') as FormControl;
  }

  get prenomControl(): FormControl {
    return this.registerForm.get('prenom') as FormControl;
  }

  get ageControl(): FormControl {
    return this.registerForm.get('age') as FormControl;
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
      name: `${this.prenomControl.value} ${this.nomControl.value}`,
      email: this.emailControl.value,
      password: this.passwordControl.value,
      age: this.ageControl.value,
    };


    this.authService.register(registerData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = res?.text || 'Un lien vous a été envoyé sur votre boite mail pour valider votre compte';
        console.log("✅ Mail de reset envoyé :", res);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Une erreur est survenue, veuillez réessayer.';
      }
    });
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}


