import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  // ActivatedRoute: information about the route to this instance of the HeroDetailComponent.
  //    This component is interested in the route's bag of parameters extracted from the URL.
  //    The "id" parameter is the id of the hero to display.
  // Location: an Angular service for interacting with the browser.
  //    Use it to navigate back to the view that navigated here.
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHero();
  }

  getHero(): void {
    // + operator converts a string to a number
    // parameters are all strings
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    // 666 go back after saving
    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }

}
