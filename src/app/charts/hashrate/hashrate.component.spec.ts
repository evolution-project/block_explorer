import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpService, MobileNavState } from '../../services/http.service'

import { HashrateComponent } from './hashrate.component'

describe('HashrateComponent', () => {
    let component: HashrateComponent
    let fixture: ComponentFixture<HashrateComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [HashrateComponent],
            providers: [HttpService, MobileNavState],
            imports: [HttpClientTestingModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(HashrateComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
