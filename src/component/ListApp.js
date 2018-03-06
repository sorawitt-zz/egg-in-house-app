import React from 'react';
import withAuthorization from './withAuthorization';
import LaunchModal from './LaunchModal'
import { db } from '../firebase'


// const ListAppPage = () =>
//   <div>
//       <LaunchModal
//       title={'Upload process'}
//       msg={'Success!'}
//       />
//   </div>

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



      // let message = { item: snapshot.val(), id: snapshot.key };

      // thisS.setState({ messages: [message].concat(thisS.state.messages) });

      const data = snapshot.val()
      if (data !== null) {
        Object.keys(data).forEach(key => {
          console.log(data[key].name);
          // thisS.setState({
          //   messages: newArr
          // })
          let itemApp = { iconApp: data[key].appIconUrl, appId: key };
          thisS.setState({ applicationItems: [itemApp].concat(thisS.state.applicationItems) });
        });
      }
      //     console.log("log items")

    console.log("log data item", thisS.state.applicationItems)

    })
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
         
         </tr>
      ))}
      
    </tbody>
  </table>
</div>

    //   <ul>

    //  </ul>
    )
  }

}


const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(ListAppPage);
