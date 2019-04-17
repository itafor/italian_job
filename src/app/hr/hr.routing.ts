import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { InterviewsComponent } from './components/interviews/interviews.component';
import { ListRolesComponent } from './components/list-roles/list-roles.component';
import { ListDepartmentsComponent } from './components/list-departments/list-departments.component';
import { ViewEmployeeComponent } from './components/view-employee/view-employee.component';
import { EventsComponent } from './components/events/events.component';
import { ListLeaveComponent } from './components/list-leave/list-leave.component';

export const HRRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'employees',
        component: EmployeesComponent,
        data: {
          heading: 'Employees'
        },
      },
      {
        path: 'roles',
        component: ListRolesComponent,
        data: {
          heading: 'Roles'
        },
      },
      {
        path: 'departments',
        component: ListDepartmentsComponent,
        data: {
          heading: 'Departments'
        }
      },
      {
        path: 'events',
        component: EventsComponent,
        data: {
          heading: 'Events'
        }
      },
       {
        path: 'leave',
        component: ListLeaveComponent,
        data: {
          heading: 'Leave Type'
        }
      },
      {
        path: 'employees/:id',
        component: ViewEmployeeComponent,
        data: {
          heading: 'Employee'
        }
      },
      {
        path: 'interviews',
        component: InterviewsComponent,
        data: {
          heading: 'Schedule Interview'
        }
      },
    ]
  }
];
