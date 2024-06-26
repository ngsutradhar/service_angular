import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';


@Injectable()
// @ts-ignore
export class AuthInterceptor implements HttpInterceptor {
  userData: { id?: number; personName?: string; _authKey?: string; personTypeId?: number; } = {
    id: 0,
    personName: '',
    _authKey: '',
    personTypeId: 0
  };
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('user')){
      this.userData = JSON.parse(<string>localStorage.getItem('user'));
    }else{
      this.userData = {id: 0, personName: 'No Person', _authKey: 'no key', personTypeId: 0};
    }
    // Clone the request to add the new header.


    let headers = req.headers
      .set('Access-Control-Allow-Headers', 'Content-Type, x-auth-token')
      .set('Access-Control-Allow-Origin', '*')
      .set('Referrer-Policy', '')
      .set('Authorization', 'Bearer ' + this.userData._authKey);
    // const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.userData._authKey) });
    const authReq = req.clone({ headers });
    // send the newly created request
    return next.handle(authReq).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    // handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      // navigate /delete cookies or whatever
      // this.router.navigateByUrl('/auth');
      // this.authService.logout();
      // @ts-ignore
      this.authService.userBehaviorSubject.next(null);
      localStorage.removeItem('user');
      // this.authService.redirectToRoot();
      // localStorage.removeItem('user');
      // this.router.navigate(['/auth']);

      // tslint:disable-next-line:max-line-length
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

}
