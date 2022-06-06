import { Component, OnInit } from '@angular/core'
import { HttpService, MobileNavState } from '../../services/http.service'
import { Chart } from 'angular-highcharts'
import { SubscriptionTracker } from '../../subscription-tracker/subscription-tracker'
import { take } from 'rxjs/operators'

@Component({
    selector: 'app-avg-block-size',
    templateUrl: './avg-block-size.component.html',
    styleUrls: ['./avg-block-size.component.scss']
})
export class AvgBlockSizeComponent
    extends SubscriptionTracker
    implements OnInit
{
    navIsOpen: boolean
    searchIsOpen: boolean
    activeChart: string
    period: string
    InputArray: any
    AvgBlockSizeChart: Chart
    seriesData: any
    loader: boolean

    constructor(
        private httpService: HttpService,
        private mobileNavState: MobileNavState
    ) {
        super()
        this.navIsOpen = false
        this.searchIsOpen = false
        this.activeChart = 'AvgBlockSize'
        this.period = 'all'
    }

    static drawChart(activeChart, titleText, yText, chartsData): Chart {
        return new Chart({
            chart: {
                type: 'line',
                backgroundColor: '#26064d',
                height: 700,
                width: null,
                zoomType: 'x'
            },
            title: {
                text: titleText,
                style: {
                    color: '#fff',
                    fontSize: '18px'
                }
            },
            credits: { enabled: false },
            exporting: { enabled: false },
            legend: {
                enabled: true,
                itemStyle: {
                    color: '#9eaacc',
                    fontFamily: 'Helvetica'
                },
                itemHoverStyle: {
                    color: '#9eaacc'
                }
            },
            tooltip: {
                enabled: true,
                shared: true,
                valueDecimals: 0,
                xDateFormat: '%Y/%m/%d %H:%M',

                pointFormatter: function () {
                    const point = this
                    return (
                        '<b style="color:' +
                        point.color +
                        '">\u25CF</b> ' +
                        point.series.name +
                        ': <b>' +
                        point.y +
                        '</b><br/>'
                    )
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: []
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 2,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#9eaacc',
                        fontSize: '11px'
                    },
                    format: '{value:%d.%b}'
                }
            },
            yAxis: {
                floor: 0,
                title: {
                    text: yText,
                    style: {
                        color: '#9eaacc'
                    }
                },
                labels: {
                    style: {
                        color: '#9eaacc',
                        fontSize: '11px'
                    }
                }
            },
            navigator: { enabled: true },
            rangeSelector: {
                // height: 60,
                enabled: true,
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'day',
                        count: 1,
                        text: 'day'
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: 'week'
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: 'month'
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: 'quarter'
                    },
                    {
                        type: 'year',
                        count: 1,
                        text: 'year'
                    },
                    {
                        type: 'all',
                        text: 'all'
                    }
                ],
                selected: 1,
                labelStyle: {
                    color: '#9eaacc'
                },
                inputStyle: {
                    color: '#9eaacc',
                    backgroundColor: '#26064d'
                },
                inputBoxBorderColor: '#9eaacc',
                inputBoxWidth: 120,
                inputBoxHeight: 16,
                buttonTheme: {
                    width: 60,
                    fill: '#32439f',
                    style: {
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'Helvetica',
                        fontWeight: '300',
                        opacity: 1
                    },
                    states: {
                        hover: {
                            fill: '#32439f'
                        },
                        select: {
                            fill: '#32439f',
                            stroke: '#fff',
                            'stroke-width': 1,
                            style: {
                                color: '#fff',
                                opacity: 1,
                                fontWeight: 400
                            }
                        },
                        disabled: {
                            fill: '#32439f',
                            style: {
                                color: '#fff',
                                opacity: 0.5,
                                fontWeight: 400,
                                cursor: 'default'
                            }
                        }
                    }
                }
            },
            series: chartsData,
            responsive: {
                rules: [
                    {
                        condition: {
                            maxWidth: 575
                        },
                        chartOptions: {
                            chart: {
                                width: 575
                            },
                            rangeSelector: {
                                // height: 100,
                                inputPosition: {
                                    align: 'left'
                                }
                            }
                        }
                    }
                ]
            }
        })
    }

    onIsVisible($event): void {
        this.searchIsOpen = $event
    }

    ngOnInit() {
        this.mobileNavState.change.pipe(take(1)).subscribe((navIsOpen) => {
            this.navIsOpen = navIsOpen
        })
        this.initialChart()
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
    }

    initialChart() {
        this.loader = true
        this.httpService
            .getChart(this.activeChart, this.period)
            .pipe(take(1))
            .subscribe({
                next: (data) => {
                    this.InputArray = data
                    const AvgBlockSize = []
                    for (let i = 1; i < this.InputArray.length; i++) {
                        AvgBlockSize.push([
                            this.InputArray[i].at * 1000,
                            this.InputArray[i].bcs
                        ])
                    }
                    this.AvgBlockSizeChart = AvgBlockSizeComponent.drawChart(
                        false,
                        'Average Block Size',
                        'MB',
                        (this.seriesData = [
                            { type: 'area', name: 'MB', data: AvgBlockSize }
                        ])
                    )
                },
                error: (err) => console.log(err),
                complete: () => (this.loader = false)
            })
    }
}
