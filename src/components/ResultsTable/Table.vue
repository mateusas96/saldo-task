<template>
    <small class="error table">{{endpointError}}</small>
    <table v-show="showTable">
        <tr>
            <th>Date</th>
            <th>Price</th>
            <th>Buy / Sell</th>
        </tr>
        <tr v-for="(data, index) in endpointData" :key="index">
            <td>{{new Date(data.timestamp).toLocaleDateString('en-CA')}}</td>
            <td>{{data.quoteClose}}</td>
            <td></td>
        </tr>
    </table>
</template>

<script>
export default {
    props: ['symbol', 'startDate', 'endDate', 'fetchData', 'showTable'],
    data() {
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
                newVal === true ? this.fetch() : null;
            }
        }
    },
    methods: {
        fetch() {
            let period1 = (new Date(this.startDate).getTime()) / 1000;
            let period2 = (new Date(this.endDate).getTime()) / 1000;

            fetch(`https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${this.symbol}?period1=${period1}&period2=${period2}&interval=1d`)
                .then(async response => {
                    if (response.status === 200) {
                        this.endpointData = [];

                        await response.json()
                            .then(data => {
                                data.chart.result[0].timestamp.forEach((element, index) => {
                                    this.endpointData.push({
                                        'timestamp': element * 1000,
                                        'quoteClose': data.chart.result[0].indicators.quote[0].close[index],
                                    });
                                });
                            });
                        this.endpointError = '';
                    } else {
                        await response.json()
                            .then(data => this.endpointError = data.chart.error.description);
                    }
                });
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