import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Denom } from './denom.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DenomService {

    private resourceUrl = 'ayoapp/api/denoms';
    private resourceSearchUrl = 'ayoapp/api/_search/denoms';

    constructor(private http: Http) { }

    create(denom: Denom): Observable<Denom> {
        const copy = this.convert(denom);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(denom: Denom): Observable<Denom> {
        const copy = this.convert(denom);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Denom> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(denom: Denom): Denom {
        const copy: Denom = Object.assign({}, denom);
        return copy;
    }
}
