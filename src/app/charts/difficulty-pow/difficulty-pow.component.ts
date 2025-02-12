import { Component, OnInit } from '@angular/core'
import { Chart } from 'angular-highcharts'
import { SubscriptionTracker } from '../../subscription-tracker/subscription-tracker'
import { take } from 'rxjs/operators'
import { HttpService, MobileNavState } from '../../services/http.service'

@Component({
    selector: 'app-difficulty-pow',
    templateUrl: './difficulty-pow.component.html',
    styleUrls: ['./difficulty-pow.component.scss']
})
export class DifficultyPowComponent
    extends SubscriptionTracker
    implements OnInit
{
    navIsOpen: boolean
    searchIsOpen: boolean
    activeChart: string
    period: string
    powDifficulty: any
    difficultyChart: Chart
    seriesData: any
    loader: boolean
    seriesType: string = 'other'

    constructor(
        private httpService: HttpService,
        private mobileNavState: MobileNavState
    ) {
        super()
        this.navIsOpen = false
        this.searchIsOpen = false
        this.activeChart = 'pow-difficulty'
        this.period = 'all'
    }

    drawChart(activeChart, titleText, yText, chartsData): Chart {
        const that = this
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
                enabled: false,
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
                },
                // crosshairs: true,
                shared: true
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
                enabled: true,
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'day',
                        count: 1,
                        text: 'day',
                        events: {
                            click: function (e) {
                                that.changeSource('day')
                            }
                        }
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: 'week',
                        events: {
                            click: function (e) {
                                that.changeSource('other')
                            }
                        }
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: 'month',
                        events: {
                            click: function (e) {
                                that.changeSource('other')
                            }
                        }
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: 'quarter',
                        events: {
                            click: function (e) {
                                that.changeSource('other')
                            }
                        }
                    },
                    {
                        type: 'year',
                        count: 1,
                        text: 'year',
                        events: {
                            click: function (e) {
                                that.changeSource('other')
                            }
                        }
                    },
                    {
                        type: 'all',
                        text: 'all',
                        events: {
                            click: function (e) {
                                that.changeSource('other')
                            }
                        }
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

    changeSource(value: string) {
        if (this.seriesType !== value) {
            this.seriesType = value
            let chartData = []
            if (value === 'day') {
                chartData = this.powDifficulty.detailed
            } else {
                chartData = this.powDifficulty.aggregated
            }
            const powDifficultyArray = []
            for (let i = 1; i < chartData.length; i++) {
                powDifficultyArray.push([
                    chartData[i].at * 1000,
                    parseInt(chartData[i].d, 10)
                ])
            }
            this.difficultyChart.removeSeries(0)
            this.difficultyChart.addSeries(
                {
                    type: 'area',
                    name: 'PoW difficulty',
                    data: powDifficultyArray
                },
                true,
                true
            )
        }
    }

    onIsVisible($event): void {
        this.searchIsOpen = $event
    }

    ngOnInit() {
        this.mobileNavState.change.subscribe((navIsOpen) => {
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
                    this.powDifficulty = data
                    const powDifficultyArray = []
                    for (
                        let i = 1;
                        i < this.powDifficulty.aggregated.length;
                        i++
                    ) {
                        powDifficultyArray.push([
                            this.powDifficulty.aggregated[i].at * 1000,
                            parseInt(this.powDifficulty.aggregated[i].d, 10)
                        ])
                    }
                    this.difficultyChart = this.drawChart(
                        false,
                        'PoW Difficulty',
                        'PoW Difficulty',
                        (this.seriesData = [
                            {
                                type: 'area',
                                name: 'PoW difficulty',
                                data: powDifficultyArray
                            }
                        ])
                    )
                },
                error: (err) => console.log(err),
                complete: () => (this.loader = false)
            })
    }
}
