import { Component,OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component'; // 🔹 Chemin à adapter selon ton projet
import { HeaderComponent } from './layout/header/header.component'; // 🔹 Chemin à adapter selon ton projet
import { AuthService } from './core/services/auth/auth.service'; // 🔹 Chemin à adapter selon ton projet

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  title = 'AdminFindersKeepers';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    window.addEventListener('beforeunload', () => {
      this.authService.logout().subscribe({
        complete: () => console.log('Déconnexion à la fermeture de la page')
      });
    });
  }
}