<template>
    <div id="main">
        <table>
            <tbody>
                <tr>
                    <th>Symbol</th>
                    <td>
                        <tr>
                            <input
                                type="text"
                                v-model="symbol"
                                v-bind:style="symbolErrors.length > 0 ? 'border-color: red' : 'border-color: black'"
                            >
                        </tr>
                        <tr v-for="error in symbolErrors" :key="error">
                            <small class="error">{{error}}</small>
                        </tr>
                    </td>
                    <th></th>
                    <td><button class="favorites">Add to favorites</button></td>
                </tr>
                <tr>
                    <th>Start date</th>
                    <td>
                        <tr>
                            <input
                                type="date"
                                v-model="startDate"
                                :max="endDate || maxDate()"
                                v-bind:style="startDateErrors.length > 0 ? 'border-color: red' : 'border-color: black'"
                            >
                        </tr>
                        <tr v-for="error in startDateErrors" :key="error">
                            <small class="error">{{error}}</small>
                        </tr>
                    </td>
                    <th>End date</th>
                    <td>
                        <tr>
                            <input
                                type="date"
                                v-model="endDate"
                                :min="startDate"
                                :max="maxDate()"
                                v-bind:style="endDateErrors.length > 0 ? 'border-color: red' : 'border-color: black'"
                            >
                        </tr>
                        <tr v-for="error in endDateErrors" :key="error">
                            <small class="error">{{error}}</small>
                        </tr>
                    </td>
                </tr>
            </tbody>
        </table>
        <button 
            v-on:click="validateFields(symbol, startDate, endDate)" 
            class="fetch"
        >Fetch</button>
        <Table 
            :symbol="symbol"
            :startDate="startDate"
            :endDate="endDate"
            :fetchData="fetchData"
            :showTable="showTable"         
        />
    </div>
</template>

<script>
import './App.css';
import Table from './components/ResultsTable/Table.vue';

export default {
    name: 'App',
    components: {
        Table
    },
    data: () => {
        return {
            symbol: null,
            startDate: null,
            endDate: null,
            fetchData: false,
            showTable: false,
            symbolErrors: [],
            startDateErrors: [],
            endDateErrors: [],
        }
    },
    watch: {
        symbol: {
            handler: function(newVal) {
                this.validateSymbol(newVal);
            }
        },
        startDate: {
            handler: function(newVal) {
                this.validateStartDate(newVal);
            }
        },
        endDate: {
            handler: function(newVal) {
                this.validateEndDate(newVal);
            }
        }
    },
    methods: {
        maxDate() {
            let date = new Date();

            let year = date.getFullYear();
            let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
            let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            
            return `${year}-${month}-${day}`;
        },
        validateFields(symbol, startDate, endDate) {
            this.validateSymbol(symbol);

            this.validateStartDate(startDate);

            this.validateEndDate(endDate);

            if (
                this.symbolErrors.length === 0 &&
                this.startDateErrors.length === 0 &&
                this.endDateErrors.length === 0
            ) {
                this.fetchData = true;
                this.showTable = true;
            } else {
                this.fetchData = false;
            }
        },
        validateSymbol(symbol) {
            if (symbol === '' || symbol === null) {
                this.symbolErrors.indexOf('Symbol is required') === -1 ?
                    this.symbolErrors.push('Symbol is required') :
                    null;
            } else {
                let pos = this.symbolErrors.indexOf('Symbol is required');
                this.symbolErrors.splice(pos, 1);
            }
            this.fetchData = false;
        },
        validateStartDate(startDate) {
            if (startDate === '' || startDate === null) {
                this.startDateErrors.indexOf('Symbol is required') === -1 ?
                    this.startDateErrors.push('Symbol is required') :
                    null;
            } else {
                let pos = this.startDateErrors.indexOf('Start date is required');
                this.startDateErrors.splice(pos, 1);
            }
            this.fetchData = false;
        },
        validateEndDate(endDate) {
            if (endDate === '' || endDate === null) {
                this.endDateErrors.indexOf('Symbol is required') === -1 ?
                    this.endDateErrors.push('Symbol is required') :
                    null;
            } else {
                let pos = this.endDateErrors.indexOf('End date is required');
                this.endDateErrors.splice(pos, 1);
            }
            this.fetchData = false;
        }
    }
}
</script>
