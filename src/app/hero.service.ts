import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';

import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  //  the address of the heroes resource on the server.
  private heroesUrl = 'api/heroes';

  // inject MessageService into HeroService, and then injected into HeroesComponent
  // "service-in-service"
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getHero(id: number): Observable<Hero> {
    // a different request url
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`HeroService: fetched hero ${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  getHeroes(): Observable<Hero[]> {
    // HttpClient.get returns the body of the response as an untyped JSON object by default.
    // Applying the optional type specifier, <Hero[]> , gives you a typed result object.
    // Here in the service it returns an array of Hero objects.
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        // tap operator looks at the observable values, does something with those values, and passes them along
        tap(_ => this.log('HeroService: fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`HeroService: updated hero id = ${hero.id}`)),
        catchError(this.handleError<any>('updatedHero'))
      );
  }

  // It will expect the server to generate an id for the new id,
  // which it returns in Observable<Hero> to the caller.
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((theHero: Hero) => this.log(`HeroService: added hereo w/ id = ${theHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions)
      .pipe(
        tap(_ => this.log(`HeroServices: deleted hero ${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    // includes a query string with the search term
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`HeroService: found heroes matching ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // TODO default visibility?
  private log(message: string): void {
    this.messageService.add(message);
  }

  getMessageService(): MessageService {
    return this.messageService;
  }
}
