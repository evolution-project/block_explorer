import { HttpClientTestingModule } from '@angular/common/http/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpService, MobileNavState } from '../../services/http.service'

import { DifficultyComponent } from './difficulty.component'

describe('DifficultyComponent', () => {
    let component: DifficultyComponent
    let fixture: ComponentFixture<DifficultyComponent>

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [DifficultyComponent],
            providers: [HttpService, MobileNavState],
            imports: [HttpClientTestingModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
