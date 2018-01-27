import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run(root) {
  ReactDOM.render(<Game />, root);
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.reset();
  }

  reset() {
    var letterCodes = new Set();
    var letters = Array(8).fill(0).map(() => {
      var rand;
      while (true) {
        rand = Math.floor(Math.random() * (74 - 66) + 65);
        if (!letterCodes.has(rand)) { letterCodes.add(rand); break; }
      }
      return String.fromCharCode(rand);
    });  
    letters = letters.concat(letters.slice(0));
    return {
      tiles: letters.sort(() => 0.5 - Math.random()).reduce((obj, v, i) => {
        obj[i] = {isVisible: false, isSolved:false, value:v}
        return obj
      }, []),
      selectedIds: [],
      clicks: 0
    };
  }

  hideTiles(ids=[]) {
    var tiles = this.state.tiles;
    ids.forEach((id) => {
      if (!tiles[id].isSolved) {
        tiles[id].isVisible = false;
      }
    });
    this.setState({tiles: tiles, selectedIds: []});
  }

  toggle(params) {
    this.state.selectedIds.push(params.id);
    var selectedIds = this.state.selectedIds;
    if (selectedIds.length <= 2) {
      var currentId = (selectedIds.length == 1 ? selectedIds[0] : selectedIds[1]);
      var tiles = this.state.tiles;
      var tilesToHide = [];
      var clicks = (tiles[currentId].isSolved ? this.state.clicks : this.state.clicks + 1);
      if (selectedIds.length >= 2 && selectedIds[0] != selectedIds[1] && tiles[selectedIds[0]].value === tiles[selectedIds[1]].value) {
          tiles[selectedIds[1]].isVisible = tiles[selectedIds[1]].isSolved = tiles[selectedIds[0]].isVisible = tiles[selectedIds[0]].isSolved = true;
      } else {
        tilesToHide = tilesToHide.concat(selectedIds.filter(id => !tiles[id].isSolved));
      }
      tiles[currentId].isVisible = true;
      this.setState({tiles: tiles, clicks: clicks, selectedIds: selectedIds}, () => {
          setTimeout(() => this.hideTiles(tilesToHide), 1000);
      });
    }
  }
  
  render() {
    var toggle = this.toggle.bind(this);
    return (
      <div>
        <h4>
          Clicks: {this.state.clicks}
        </h4>
        <div className="tiles">
          {this.state.tiles.map((v, i) => <Tile key={i} id={i} value={v.value} isVisible={v.isVisible} isSolved={v.isSolved} toggle={toggle} />)}
        </div>
        <div className="clear" /><br />
        <Button onClick={ () => this.setState(this.reset()) }>Reset</Button>
      </div>
    )
  }

}

function Tile(params) {
  var outerStyle = {color: (params.isSolved ? "green" : "black")};
  var innerStyle = (!params.isVisible ? {visibility: "hidden"} : {});
  return (
    <div className="tile" style={outerStyle} onClick={() => params.toggle(params)} >
      <div style={innerStyle} >
        {params.value}
      </div>
    </div>
  )
}
