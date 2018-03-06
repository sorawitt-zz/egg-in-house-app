import React from 'react';
import withAuthorization from './withAuthorization';
import LaunchModal from './LaunchModal'
import { db } from '../firebase'
import UpdateAppModel from './UpdateAppModel';

class ListAppPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      applicationItems: []
    }

  }


  componentWillMount(){
  
  this.fetchItem()
  }  

  fetchItem() {
    var thisS = this
    db.getApplication().then(function (snapshot) {
      console.log("data", snapshot.val())

      const data = snapshot.val()
      if (data !== null) {
        Object.keys(data).forEach(key => {
          console.log(data[key].name);
          let itemApp = { iconApp: data[key].appIconUrl, appId: key };
          thisS.setState({ applicationItems: [itemApp].concat(thisS.state.applicationItems) });
        });
      }
    console.log("log data item", thisS.state.applicationItems)

    })
  }

  handleEdit = (e) => {
    var thiss = this
    console.log("name app", e.target.value)
    
  }

  render() {

    {console.log("ss")}
    return (
      <div className="container">
  <h2>Hover Rows</h2>

  <p>The .table-hover class enables a hover state on table rows:</p>            
  <table className="table table-hover">
    <thead>
      <tr>
        <th>app icon</th>
        <th>Name Applcation</th>

      </tr>
    </thead>
    <tbody>
      
     {this.state.applicationItems.map(item => (
        <tr key={item.appId}>
        <td><img src={item.iconApp} alt={item.iconApp} width="32px"/></td>
         <td>{item.appId}</td>
         <td><button value={item.appId} onClick={this.handleEdit}> </button></td>
         </tr>
      ))}
      
    </tbody>
  </table>
</div>
    )
  }

}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ListAppPage);
