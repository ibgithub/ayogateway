import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Harga } from './harga.model';
import { HargaPopupService } from './harga-popup.service';
import { HargaService } from './harga.service';

@Component({
    selector: 'jhi-harga-dialog',
    templateUrl: './harga-dialog.component.html'
})
export class HargaDialogComponent implements OnInit {

    harga: Harga;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private hargaService: HargaService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.harga.id !== undefined) {
            this.subscribeToSaveResponse(
                this.hargaService.update(this.harga));
        } else {
            this.subscribeToSaveResponse(
                this.hargaService.create(this.harga));
        }
    }

    private subscribeToSaveResponse(result: Observable<Harga>) {
        result.subscribe((res: Harga) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Harga) {
        this.eventManager.broadcast({ name: 'hargaListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-harga-popup',
    template: ''
})
export class HargaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private hargaPopupService: HargaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.hargaPopupService
                    .open(HargaDialogComponent as Component, params['id']);
            } else {
                this.hargaPopupService
                    .open(HargaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
