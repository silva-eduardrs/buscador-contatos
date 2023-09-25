import {} from 'googlemaps';

import { Component, OnInit } from '@angular/core';

import { ExpressaoPesquisada } from '../shared/interfaces/expressoes-pesquisadas.interface';
import { ExpressoesPesquisadasService } from '../shared/services/expressoes-pesquisadas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  textoPesquisa: string = '';
  infos: Array<google.maps.places.PlaceResult> = [];
  expressoes: Array<ExpressaoPesquisada> = [];

  constructor(private expressoesService: ExpressoesPesquisadasService) {}

  ngOnInit(): void {
    //this.buscarExpressoes();
  }

  buscarExpressoes() {
    this.expressoesService
      .recuperarExpressoesPesquisadas()
      .subscribe((result) => {
        this.expressoes = result;
      });
  }

  buscar() {
    this.tratarPesquisa();

    this.infos = [];
    const location = new google.maps.LatLng(-27.6427, -48.6695);

    const map = new google.maps.Map(document.getElementById('map')!, {
      center: location,
      zoom: 15,
    });

    const query = {
      location: location,
      query: this.textoPesquisa!,
      fields: ['place_id'],
    };

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(query, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach((result) => {
          const details = {
            placeId: result.place_id!,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'international_phone_number',
              'website',
            ],
          };
          service.getDetails(details, (places, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              places
            ) {
              if (places.formatted_phone_number || places.website) {
                this.infos.push(places);
              }
            }
          });
        });
      }
    });
  }

  enviarMensagem(info: google.maps.places.PlaceResult) {
    const numero =
      '55' +
      info.formatted_phone_number
        ?.replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('-', '')
        .replaceAll(' ', '');
    const contatoWpp = 'https://wa.me/' + numero;
    window.open(contatoWpp, '_blank');
  }

  selecionarPalavra(palavra: string) {
    if(this.textoPesquisa.length) {
      this.textoPesquisa += ' ' + palavra
    } else {
      this.textoPesquisa = palavra;
    }
  }

  tratarPesquisa() {
    let req: any = {};
    const expressoesAux = JSON.parse(JSON.stringify(this.expressoes));
    const palavrasPesquisadas = this.textoPesquisa.split(' ');
    palavrasPesquisadas.forEach(palavra => {
      if (!this.expressoes.find(e => e.palavra === palavra)) {
        expressoesAux.push({id: 0, palavra});
        if (expressoesAux.length > 5) {
          const elemento = expressoesAux.shift();
          req[elemento?.palavra!] = this.expressoesService.excluirExpressaoPesquisada(elemento?.id!);
        }
        req[palavra] = this.expressoesService.gravarExpressaoPesquisada({ palavra });
      }
    });
    forkJoin(req).subscribe(retorno => {
      this.buscarExpressoes();
    })
  }
}
