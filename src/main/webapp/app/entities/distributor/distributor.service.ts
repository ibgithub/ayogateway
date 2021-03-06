import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Distributor } from './distributor.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DistributorService {

    private resourceUrl = 'ayoapp/api/distributors';
    private resourceSearchUrl = 'ayoapp/api/_search/distributors';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(distributor: Distributor): Observable<Distributor> {
        const copy = this.convert(distributor);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(distributor: Distributor): Observable<Distributor> {
        const copy = this.convert(distributor);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: number): Observable<Distributor> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
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
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.tglInput = this.dateUtils
            .convertDateTimeFromServer(entity.tglInput);
        entity.tglUpdate = this.dateUtils
            .convertDateTimeFromServer(entity.tglUpdate);
    }

    private convert(distributor: Distributor): Distributor {
        const copy: Distributor = Object.assign({}, distributor);

        copy.tglInput = this.dateUtils.toDate(distributor.tglInput);

        copy.tglUpdate = this.dateUtils.toDate(distributor.tglUpdate);
        return copy;
    }
}
