import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
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

  async handleLogin(): Promise<void> {
    this.errorMessage = "";
    const isSuccess = await this.authService.login(this.email, this.password, "traveler");
    if (!isSuccess) {
      this.errorMessage = "Invalid email or password.";
      return;
    }

    const redirectUrl = this.authService.getRedirectUrl("traveler");
    this.router.navigate([redirectUrl]);
  }

  goToRegister(): void {
    this.router.navigate(["/register"]);
  }
}
