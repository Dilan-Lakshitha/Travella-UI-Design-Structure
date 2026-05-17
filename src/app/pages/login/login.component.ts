import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService, UserRole } from "../../services/auth.service";
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
  CardFooterComponent,
} from "../../components/ui/card.component";
import {
  InputComponent,
  LabelComponent,
} from "../../components/ui/input.component";
import { IconComponent } from "../../components/ui/icons.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    InputComponent,
    LabelComponent,
    IconComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  email = "";
  password = "";
  errorMessage = "";
  role: UserRole = 'TRAVELER';
  isLoading = false;

  async handleLogin(): Promise<void> {
    this.errorMessage = "";
    this.isLoading = true;

    try {
      const isSuccess = await this.authService.login(
        this.email,
        this.password,
        this.role
      );

      if (!isSuccess) {
        this.errorMessage = "Invalid email or password.";
        return;
      }

      if (this.authService.mustResetPassword()) {
        await this.router.navigate(["/reset-password"]);
        return;
      }

      const redirectUrl = this.authService.getRedirectUrl(this.role);
      await this.router.navigate([redirectUrl]);
    } catch (error) {
      this.errorMessage = "Something went wrong. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  goToRegister(): void {
    this.router.navigate(["/register"]);
  }
}
