import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth/auth.service'; // adapte le chemin
import { SharedInputComponent } from '../../../shared/components/shared-input/shared-input.component';
import { SharedButtonComponent } from '../../../shared/components/shared-button/shared-button.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    SharedButtonComponent
  ],
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl(): FormControl {
    return this.forgotForm.get('email') as FormControl;
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

  this.authService.requestPasswordReset(this.emailControl.value).subscribe({
    next: (res: any) => {
      this.loading = false;
      this.successMessage = res?.text || 'Un lien vous a été envoyé sur votre boite mail';
      console.log("✅ Mail de reset envoyé :", res);
    },
    error: (err: any) => {
      this.loading = false;
      this.errorMessage = err?.error?.text || "Erreur lors de la demande.";
    }
  });
}
goToLogin(): void {
  this.router.navigate(['/login']);
}
goToHome(): void {
  this.router.navigate(['/home']); // ou '/' selon ta route d'accueil
}
}
