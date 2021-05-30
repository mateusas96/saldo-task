<template>
    <div class="card" v-show="favoritesList.length > 0">
        <div class="container">
            <div class="card-title">Favorites List</div>
            <ol>
                <li v-for="(favorite, index) in favoritesList" :key="index">
                    <button class="use" v-on:click="sendFavorite(favorite)">{{favorite}}
                        <span class="tooltipText">Use favorite</span>
                    </button>
                    <button class="remove" v-on:click="removeFavorite(index)">X
                        <span class="tooltipText">Remove favorite</span>
                    </button>
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
import {setCookie, getCookieByKey} from '../../js/cookies/cookies';

export default {
    props: ['refreshFavorites', 'newFavorite'],
    data: () => {
        return {
            favoritesList: [],
        }
    },
    watch: {
        refreshFavorites: {
            /**
             * watch if refreshFavorites value changes
             * then add new favorite to cookie
             */
            handler: function() {
                // retrieve data from cookie so that already saved data will not disappear
                console.log(this.newFavorite)
                let tempList = JSON.parse(getCookieByKey('favorites'));
                tempList.push(this.newFavorite);

                // set new value for cookie
                setCookie('favorites', tempList, 2147483647);
                this.favoritesList = tempList;
            }
        }
    },
    mounted() {
        // retrieve data from cookies first time
        this.favoritesList = JSON.parse(getCookieByKey('favorites'));
    },
    methods: {
        removeFavorite(index) {
            //remove from favorites lsit
            this.favoritesList.splice(index, 1);

            // set new value for cookie
            setCookie('favorites', this.favoritesList, 2147483647);
        },
        sendFavorite(favorite) {
            // send selected favorite to parent component
            this.$emit('clicked', favorite);
        }
    }
}
</script>

<style scoped>
.card {
    width: 21%;
}
.card-title {
    font-size: 1.75rem;
    width: 100%;
    border-bottom: 0.25rem solid gold;
    border-radius: 1rem;
    display: flex;
    justify-content: center;
}
li {
    width: max-content;
    padding: 0.75rem;
}
button.remove {
    background-color: white;
    color: red;
    width: max-content;
    text-align: center;
    padding: 0 1rem 0 1rem;
    margin-left: 1rem;
    position: relative;
    display: inline-block;
    border-bottom: 0.1rem dotted black;
}
.tooltipText {
    visibility: hidden;
    width: max-content;
    background-color: rgb(240, 240, 240);
    color: rgb(46, 46, 46);
    text-align: center;
    border-radius: 0.4rem;
    padding: 0.5rem;
    margin-top: 1.5rem;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    margin-left: -2rem;
}
button:hover .tooltipText {
  visibility: visible;
}
</style>