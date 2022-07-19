import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Agendas, Business } from '../agendas/agendas.model';


@Injectable()
export class AgendasService {

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

    productNames: string[] = [
        'Bamboo Watch',
        'Black Watch',
        'Blue Band',
        'Blue T-Shirt',
        'Bracelet',
        'Brown Purse',
        'Chakra Bracelet',
        'Galaxy Earrings',
        'Game Controller',
        'Gaming Set',
        'Gold Phone Case',
        'Green Earbuds',
        'Green T-Shirt',
        'Grey T-Shirt',
        'Headphones',
        'Light Green T-Shirt',
        'Lime Band',
        'Mini Speakers',
        'Painted Phone Case',
        'Pink Band',
        'Pink Purse',
        'Purple Band',
        'Purple Gemstone Necklace',
        'Purple T-Shirt',
        'Shoes',
        'Sneakers',
        'Teal T-Shirt',
        'Yellow Earbuds',
        'Yoga Mat',
        'Yoga Set',
    ];

    constructor(private http: HttpClient) { }

    getAgendas() {
        return this.http.get<any>('assets/agendas.json')
            .toPromise()
            .then(res => <Agendas[]>res.data)
            .then(data => data);
    }

    getBusiness() {
        return this.http.get<any>('assets/business.json')
            .toPromise()
            .then(res => <Business[]>res.data)
            .then(data => data );
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/agendas.json')
            .toPromise()
            .then(res => <Agendas[]>res.data)
            .then(data => data );
    }

    generatePrduct(): Agendas {
        const agendas: Agendas =  {
            id: this.generateId(),
            label: this.generateName(),
            createdDate: new Date()
        };

        return agendas;
    }

    generateId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.productNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generatePrice() {
        return Math.floor(Math.random() * Math.floor(299) + 1);
    }

    generateQuantity() {
        return Math.floor(Math.random() * Math.floor(75) + 1);
    }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    generateRating() {
        return Math.floor(Math.random() * Math.floor(5) + 1);
    }
}
