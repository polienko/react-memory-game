import React from "react";

import img_cover from "../img/cover.png";

const SHOW_SECOND_CARD_TIME = 500;
const SCORE_PLUS = 50;
const SCORE_MINUS = -10;

let BOARD_LOCKED = false;

let MATCH_COUNTER;

class Card extends React.Component{
    constructor(props){
      super(props);
      let CARDS = this.props.CARDS;
      MATCH_COUNTER = this.props.MATCH_COUNTER;
      this.state = {
        MATCHES_TO_WIN: CARDS.length / 2,
        class: "card",
      }
      this.cardHandler = this.cardHandler.bind(this);
    }
    cardHandler(){
      if (this.state.class == "card match" || this.state.class == "card flip") {
        return "CAN'T CLICK ON CARD";
      } 
      if (BOARD_LOCKED){
        return "CAN'T CLICK ON CARD";
      }
  
      let boardHandlerResult = this.props.boardHandler(this);
  
      if (boardHandlerResult == "FIRST CARD"){
        this.state.class == "card" ? this.setState({class:"card flip"}) : this.setState({class:this.state.class});
      } else if (typeof boardHandlerResult === 'object' && boardHandlerResult !== null) {
        let previousCard = boardHandlerResult;
        if (previousCard.props.data == this.props.data) {
          previousCard.setState({class:"card match"});
          this.setState({class:"card match"});
          this.props.updateScore(SCORE_PLUS);
          MATCH_COUNTER += 1;
          if (MATCH_COUNTER == this.state.MATCHES_TO_WIN){
            let currentScore = parseInt(document.getElementById("score").innerText) + SCORE_PLUS;
            if (sessionStorage.getItem('score') == ""){
              sessionStorage.setItem('score', currentScore);
            } else {
              sessionStorage.setItem('score', sessionStorage.getItem('score') + ";" + currentScore);
            }
            console.log("SCORE: "+sessionStorage.getItem('score'));
          }
        } else {
          BOARD_LOCKED = true;
          this.setState({class:"card flip"});
          this.props.updateScore(SCORE_MINUS);
          setTimeout(() => {
            previousCard.setState({class:"card"}); 
            this.setState({class:"card"});
            BOARD_LOCKED = false;
            }, SHOW_SECOND_CARD_TIME);
        }
      }
    }
    render(){
      return(
        <div className={this.state.class} key={this.props.index} onClick={this.cardHandler} >
          <img className="card-front" src={this.props.path} data-card={this.props.data} draggable="false" />
          <img className="card-back" src={img_cover} alt="" data-card={this.props.data} draggable="false" />
        </div>
      );
    }
  }

  export default Card;