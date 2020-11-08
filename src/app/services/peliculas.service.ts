import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { MovieResponse } from '../interfaces/movie-response';
import { Cast, CastResponse } from '../interfaces/cast-response';


@Injectable({
  providedIn: 'root'
})
export class PeliculasService {

  private baseUrl: string = 'https://api.themoviedb.org/3';
  private carteleraPage = 1;
  public cargando: boolean = false;

  constructor( private http: HttpClient) { }

  get params() {
    return {
      api_key: '4f18ee7748048ed112f5132c82014bc7',
      language: 'es-ES',
      page: this.carteleraPage.toString()
    }
  }

  resetCarteleraPage() {
    this.carteleraPage = 1;
  }

  getCartelera():Observable<Movie[]> {

    if(this.cargando){
      return of([]) ;
    }
    this.cargando = true;

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing`, {
      params: this.params
    }).pipe(
      map( (resp) => resp.results ),
      tap( () => {
        this.carteleraPage += 1;
        this.cargando = false;
      })
    )
  }

  //https://api.themoviedb.org/3/search/movie?api_key=4f18ee7748048ed112f5132c82014bc7&language=en-US&page=1&include_adult=false

  buscarPeliculas ( texto: string ) {

    const params = { 
      ...this.params,
      page: '1',
      query: texto,
      include_adult: 'false'
    }

    return this.http.get<CarteleraResponse>(`${ this.baseUrl }/search/movie`, {
      params
    })
      .pipe(
        map( resp => resp.results )
      )
  }

  //https://api.themoviedb.org/3/movie/724989?api_key=4f18ee7748048ed112f5132c82014bc7&language=es-ES

  getPeliculaDetalle ( id: string ) {

    return this.http.get<MovieResponse>( `${this.baseUrl}/movie/${id}`, {
      params: this.params })
        .pipe(
          catchError( err => of(null))
        )
  }

  getCastPelicula ( id: string ):Observable<Cast[]> {

    return this.http.get<CastResponse>( `${this.baseUrl}/movie/${id}/credits`, {
      params: this.params })
        .pipe(
          map( resp => resp.cast ),
          catchError( err => of(null))
        )
  }
}
