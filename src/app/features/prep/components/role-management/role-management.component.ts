import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { Role } from '../../../../models/role.model';
import { RoleService } from '../../../../services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ResetPasswordDialogComponent } from '../../../dialogs/reset-password-dialog/reset-password-dialog.component';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-role-management',
  standalone: false,
  
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit {
  users: User[] = [];
  availableRoles: Role[] = [];
  selectedUser: User | null = null;

  
  constructor(
    private roleService: RoleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.roleService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((roles) => {
      console.log('Roles fetched:', roles); // Debug log
      this.availableRoles = roles;
    }, (error) => {
      console.error('Error fetching roles:', error); // Log any errors
    });
  }
  

  selectUser(user: User) {
    this.selectedUser = user;
  }

  userHasRole(roleName: string): boolean {
    if (this.selectedUser) {
      return this.selectedUser.roles.some(role => role.name === roleName);
    }
    return false;
  }

  toggleRole(role: Role, event: MatCheckboxChange) {
    if (this.selectedUser) {
      if (event.checked) {
        // Add the role if it is checked and not already present
        if (!this.userHasRole(role.name)) {
          this.selectedUser.roles.push(role);
        }
      } else {
        // Remove the role if unchecked
        this.selectedUser.roles = this.selectedUser.roles.filter(r => r.name !== role.name);
      }
    }
  }

  saveRoles() {
    if (this.selectedUser) {
      const rolesToSave = this.selectedUser.roles.map(role => role.name);
      this.roleService.updateUserRoles(this.selectedUser.id, rolesToSave).subscribe(response => {
        this.snackBar.open('Roles updated successfully', 'Close', {
          duration: 3000,
        });
      });
    }
  }

  resetPassword(userId: number) {
    // Instead of using prompt, we can create a material dialog for this
    const dialogRef = this.dialog.open(ResetPasswordDialogComponent);
    
    dialogRef.afterClosed().subscribe(newPassword => {
      if (newPassword) {
        this.roleService.resetPassword(userId, newPassword).subscribe(response => {
          this.snackBar.open('Password reset successfully', 'Close', {
            duration: 3000,
          });
        });
      }
    });
  }

  deleteUser(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.deleteUser(userId).subscribe(response => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadUsers();
        });
      }
    });
  }
}
