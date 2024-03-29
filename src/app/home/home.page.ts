import { Component } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { ApiserviceService } from './../services/apiservice.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private afs: AngularFirestore,private api: ApiserviceService) {
  }

   
  numberValue: number = 0;
  cardTitle: string = 'Pokemon Card';
  pokemonImage: string = '';
  pokemonTypes: string = '';
  searchPokemonID: number | undefined; 

  
  searchQuery: string = '';
  searchCardTitle: string = 'Search Result';
  searchPokemonImage: string = '';
    
  searchByPokemonID() {
    if (this.searchPokemonID) {
      this.getPokemonDataByID(this.searchPokemonID, false);
    }
  }
  
  
  savePokemonTypeToFirebase(type: string) {
    try {
      const pokemonRef = this.afs.collection('pokemones').doc('pokemon');
      pokemonRef.set({
        type: type
      }).then(() => {
        console.log(`Tipo de Pokémon actualizado en Firebase: ${type}`);
      }).catch(error => {
        console.error('Error al actualizar el tipo de Pokémon en Firebase:', error);
      });
    } catch (error) {
      console.log(error);
    }
  }
  getPokemonDataByID(id: number, isSearchCard: boolean) {
    try {
      this.api.getPokemonID(id).subscribe((response => {
        const pokemon = response.name;
        const types = response.types.map((type: any) => type.type.name);
  
        
        const typeToSave = types[0];
        this.savePokemonTypeToFirebase(typeToSave);
  
        if (isSearchCard) {
          this.searchCardTitle = pokemon;
          this.searchPokemonImage = response.sprites.front_default;
        } else {
          this.cardTitle = pokemon;
          this.pokemonImage = response.sprites.front_default;
          
          this.pokemonTypes = types.join(', ');
        }
      }));
    } catch (error) {
      console.log(error);
    }
  }

  
  resetSearch() {
    this.searchQuery = '';
    this.searchCardTitle = 'Search Result';
    this.searchPokemonImage = '';
  }
}
