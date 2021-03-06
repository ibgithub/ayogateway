import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Operator } from './operator.model';
import { OperatorPopupService } from './operator-popup.service';
import { OperatorService } from './operator.service';

@Component({
    selector: 'jhi-operator-dialog',
    templateUrl: './operator-dialog.component.html'
})
export class OperatorDialogComponent implements OnInit {

    operator: Operator;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private operatorService: OperatorService,
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
        if (this.operator.id !== undefined) {
            this.subscribeToSaveResponse(
                this.operatorService.update(this.operator));
        } else {
            this.subscribeToSaveResponse(
                this.operatorService.create(this.operator));
        }
    }

    private subscribeToSaveResponse(result: Observable<Operator>) {
        result.subscribe((res: Operator) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Operator) {
        this.eventManager.broadcast({ name: 'operatorListModification', content: 'OK'});
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
    selector: 'jhi-operator-popup',
    template: ''
})
export class OperatorPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private operatorPopupService: OperatorPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.operatorPopupService
                    .open(OperatorDialogComponent as Component, params['id']);
            } else {
                this.operatorPopupService
                    .open(OperatorDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
