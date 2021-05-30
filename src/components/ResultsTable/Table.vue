<template>
    <div v-show="showTable">
        <small class="error table">{{endpointError}}</small>
        <div>Maximum profit: <span id="profit"></span></div>
        <table>
            <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Buy / Sell</th>
            </tr>
            <tr v-for="(data, index) in endpointData" :key="index">
                <!-- converted for more readable date format -->
                <td>{{new Date(data.timestamp).toLocaleDateString('en-CA')}}</td>
                <td>{{data.quoteClose}}</td>
                <td>{{data.indicator}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'ResultsTable',
    props: ['symbol', 'startDate', 'endDate', 'fetchData', 'showTable'],
    data: () => {
        return {
            endpointError: '',
            endpointData: [],
        }
    },
    mounted() {
    },
    watch: {
        fetchData: {
            handler: function(newVal) {
                /**
                 * watch if fetchData value changes and if new value is equal to true
                 * then fetch data from endpoint
                 */
                newVal === true ? this.fetch() : null;
            }
        }
    },
    methods: {
        fetch() {
            /**
             * need to divide timestap by 1000
             * othervise endpoint will throw an error
             * that date formats are incorrect
             */
            let period1 = (new Date(this.startDate).getTime()) / 1000;
            let period2 = (new Date(this.endDate).getTime()) / 1000;

            fetch(`https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${this.symbol}?period1=${period1}&period2=${period2}&interval=1d`)
                .then(async response => {
                    if (response.status === 200) {
                        this.endpointData = [];

                        await response.json()
                            .then(data => {
                                data.chart.result[0].timestamp.forEach((element, index) => {
                                    /**
                                     * need to multiply timestamp by 1000
                                     * otherwise Date() function will show date in the distant past 
                                     */
                                    this.endpointData.push({
                                        'timestamp': element * 1000,
                                        'quoteClose': data.chart.result[0].indicators.quote[0].close[index],
                                        'indicator': '',
                                    });
                                });
                                this.calculate(this.endpointData, this.endpointData.length);
                            });
                        
                        this.endpointError = '';
                    } else {
                        // store error from endpoint if something went wrong
                        await response.json()
                            .then(data => this.endpointError = data.chart.error.description);
                    }
                });
        },
        calculate(data, n) {
            let maxProfit = 0;
            // need at least two days to calculate
            if (n === 1) {
                return;
            }

            // start calculations
            let i = 0;
            while (i < n - 1) {

                /**
                 * find minimal value
                 * comparing present element to the next element
                 */
                while ((i < n -1) && (data[i+1].quoteClose <= data[i].quoteClose)) {
                    i++;
                }

                /**
                 * break if end of the array length
                 * because no further solution is possible
                 */
                if (i === n - 1) {
                    break;
                }

                // temporary save index of minimal value
                let buy = i++;

                /**
                 * find maximum value
                 * comparing to previous elements
                 */
                while ((i < n) && (data[i].quoteClose >= data[i - 1].quoteClose)) {
                    i++;
                }

                // temporary save index of maximum value
                let sell = i - 1;

                maxProfit += data[sell].quoteClose - data[buy].quoteClose;
                // save indicator for buy and sell prices
                data[buy].indicator = 'BUY';
                data[sell].indicator = 'SELL';
            }

            // set maximum profit value to element
            document.getElementById('profit').textContent = maxProfit;

            this.endpointData = [];
            this.endpointData = data;
        }
    },
}
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1rem;
}
th, td {
    border: 1px solid #dddddd;
    text-align: center;
    padding: 8px;
}
tr:nth-child(even) {
    background-color: #dddddd;
}
.error.table {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
</style>