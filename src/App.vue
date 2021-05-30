<template>
    <div id="main" class="card">
        <div class="container">
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
                                    id="symbol"
                                >
                            </tr>
                            <tr v-for="error in symbolErrors" :key="error">
                                <small class="error">{{error}}</small>
                            </tr>
                        </td>
                        <th></th>
                        <td>
                            <tr>
                                <button 
                                    class="favorites"
                                    v-on:click="addNewFavorite"
                                >Add to favorites</button>
                            </tr>
                            <tr v-for="error in favoriteErrors" :key="error">
                                <small class="error">{{error}}</small>
                            </tr>
                        </td>
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
                v-on:click="getData(symbol, startDate, endDate)" 
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
    </div>
    <List
        :refreshFavorites="refreshFavorites"
        :newFavorite="newFavorite"
        v-on:clicked="retrieveSymbol"
    />
</template>

<script>
import './App.css';
import Table from './components/ResultsTable/Table.vue';
import List from './components/FavoritesList/List.vue';
import {getCookieByKey} from './js/cookies/cookies';

export default {
    name: 'Main',
    components: {
        Table,
        List,
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
            favoriteErrors: [],
            refreshFavorites: 0,
            newFavorite: null,
        }
    },
    watch: {
    // validate values on change
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
            // calculate max date for 'End date' input field
            let date = new Date();

            let year = date.getFullYear();
            let month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
            let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
            
            return `${year}-${month}-${day}`;
        },
        getData(symbol, startDate, endDate) {
            // validate all fields before fetching data from endpoint
            this.validateSymbol(symbol);

            this.validateStartDate(startDate);

            this.validateEndDate(endDate);

            // if there are no errors fetch data
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
            /**
             * check if symbol is present
             * only then add or remove error
             */
            if (
                (symbol === '' || symbol === null) &&
                this.symbolErrors.indexOf('Symbol is required') === -1
            ) {
                this.symbolErrors.push('Symbol is required');
            } else if (
                symbol !== '' && 
                symbol !== null &&
                this.symbolErrors.indexOf('Symbol is required') !== -1
            ) {
                this.symbolErrors.splice(this.symbolErrors.indexOf('Symbol is required'), 1);
            }

            this.fetchData = false;
        },
        validateStartDate(startDate) {
            /**
             * check if start date is present
             * only then add or remove error
             */
            if (
                (startDate === '' || startDate === null) &&
                this.startDateErrors.indexOf('Start date is required') === -1
            ) {
                this.startDateErrors.push('Start date is required');
            } else if (
                startDate !== '' &&
                startDate !== null &&
                this.startDateErrors.indexOf('Start date is required') !== -1
            ) {
                this.startDateErrors.splice(this.startDateErrors.indexOf('Start date is required'), 1);
            }

            this.fetchData = false;
        },
        validateEndDate(endDate) {
            /**
             * check if end date is present
             * only then add or remove error
             */
            if (
                (endDate === '' || endDate === null) &&
                this.endDateErrors.indexOf('End date is required') === -1
            ) {
                this.endDateErrors.push('End date is required');
            } else if (
                endDate !== '' &&
                endDate !== null &&
                this.endDateErrors.indexOf('End date is required') !== -1
            ) {
                this.endDateErrors.splice(this.endDateErrors.indexOf('End date is required'), 1);
            }

            this.fetchData = false;
        },
        addNewFavorite() {
            // validate before adding new favorite
            this.validateFavorite();
            if (this.favoriteErrors.length === 0) {
                // if no errors set new favorite and refresh favorites list
                this.newFavorite = this.symbol;
                this.refreshFavorites += 1;
            }
        },
        validateFavorite() {
            /**
             * check if symbol is present
             * only then add or remove error
             */
            if (
                (this.symbol === null || this.symbol === '') &&
                this.favoriteErrors.indexOf('Favorite cannot be empty') === -1
            ) {
                this.favoriteErrors.push('Favorite cannot be empty');
            } else if (
                this.symbol !== null &&
                this.symbol !== '' &&
                this.favoriteErrors.indexOf('Favorite cannot be empty') !== -1
            ) {
                this.favoriteErrors.splice(this.favoriteErrors.indexOf('Favorite cannot be empty'), 1);
            }

            // retrieve save favorits from cookie
            let tempArr = JSON.parse(getCookieByKey('favorite'));
            let favoriteExists = false;

            tempArr.find(row => {
                /**
                 * if value already exists in cookie
                 * then set that favorite exists
                 */
                if (row === this.symbol) {
                    favoriteExists = true;
                }
            });

            /**
             * check if favorite exists
             * only then add or remove error
             */
            if (favoriteExists) {
                this.favoriteErrors.indexOf('Favorite already exists') === -1 ?
                    this.favoriteErrors.push('Favorite already exists') :
                    null;
            } else if (!favoriteExists && this.favoriteErrors.indexOf('Favorite already exists') !== -1) {
                this.favoriteErrors.splice(this.favoriteErrors.indexOf('Favorite already exists'), 1);
            }
        },
        // retrieve symbol send from child component
        retrieveSymbol(value) {
            this.symbol = value;
        }
    }
}
</script>
