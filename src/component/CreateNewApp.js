import React, { Component } from 'react';
import withAuthorization from './withAuthorization';
import { auth, db } from '../firebase';
import icon from '../icon.png'
import SingleInput from './SingleInput';
import firebase from 'firebase';


class CreateNewAppPage extends Component {
  constructor(props) {
      super(props)

      this.state = {
        name: "",
        version: "",
        build: "",
        bundleId: "",
        iconFile: "",
        imagePreviewUrl: icon,
        ipaFileUrl: "",
        appFile: ""
      }

      this.handleAddIcon = this.handleAddIcon.bind(this)
      this.handleNameChange = this.handleNameChange.bind(this)
      this.handleBuildChange = this.handleBuildChange.bind(this)
      this.handleBundleIdChange = this.handleBundleIdChange.bind(this)
      this.handleVersionChange = this.handleVersionChange.bind(this)
      this.submitForm = this.submitForm.bind(this)
      this.handleIpaFile = this.handleIpaFile.bind(this)
      this.handleSaveDataToDB = this.handleSaveDataToDB.bind(this)
  }

  

    componentWillMount(){
        console.log("willMount")
    }

    submitForm() {
      var thisS = this
     // console.log(JSON.stringify(thiss.state))


      var XMLWriter = require('xml-writer');
      var xw = new XMLWriter;
      xw.startDocument();
      xw.startElement('plist');
        xw.writeAttribute('version', "1.0");
        xw.startElement('dict')
        xw.startElement('key')
        xw.text("items")
        xw.endElement()
        xw.startElement("array")
        xw.startElement('dict')
        xw.startElement('key')
        xw.text("assets")
        xw.endElement()
        xw.startElement('array')
        xw.startElement('dict')
        xw.startElement('key')
        xw.text("kind")
        xw.endElement()
        xw.startElement('string')
        xw.text("software-package")
        xw.endElement()
        xw.startElement('key')
        xw.text("url")
        xw.endElement()
        xw.startElement('string')
        xw.text(thisS.state.ipaFileUrl)   // <--- input url for .ipa file
        xw.endElement()
        xw.endElement()
        xw.endElement()
        xw.startElement('key')
        xw.text("metadata")
        xw.endElement()
    
        xw.startElement("dict")
        xw.startElement("key")
        xw.text("bundle-identifier")
        xw.endElement()
        xw.startElement("string")
        xw.text(thisS.state.bundleId)  // <--- input bundle id
        xw.endElement()
        xw.startElement("key")
        xw.text("bundle-version")
        xw.endElement()
        xw.startElement("string")
        xw.text(thisS.state.version) // <--- input bundle id
        xw.endElement()
        xw.startElement("key")
        xw.text("kind")
        xw.endElement()
        xw.startElement("string")
        xw.text("software")
        xw.endElement()
        xw.startElement("key")
        xw.text("subtitle")
        xw.endElement()
        xw.startElement("string")
        xw.text("subtitle here") // <--- input subtitle
        xw.endElement()
        xw.startElement("key")
        xw.text("title")
        xw.endElement()
        xw.startElement("string")
        xw.text(thisS.state.name) // <--- input title here
        xw.endElement()
        xw.endDocument();

        var storage = firebase.storage();
        var storageRef = storage.ref();
        var imageRef = storageRef.child(thisS.state.name);
        var spaceRef = imageRef.child('ipa/manifest.plist');
        var file = new Blob([xw.toString()], { type: 'application/octet-stream'});
    
console.log("xw", xw.toString())
          var x = spaceRef.put(file);
          x.on('state_changed', function(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('ipa file Upload is ' + progress + '% done');
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            var downloadURL = x.snapshot.downloadURL;
            thisS.setState({
              appFile: downloadURL
            })
            console.log("download", downloadURL)
          });

    }

    handleSaveDataToDB(){
      var thisS = this

    }

  

    handleNameChange(e){
      this.setState({
        name: e.target.value
      });
    }

    handleVersionChange(e){
      this.setState({
        version: e.target.value
      });
    }

    handleBuildChange(e){
      this.setState({
        build: e.target.value
      });
    }

    handleBundleIdChange(e){
      this.setState({
        bundleId: e.target.value
      });
    }

    handleIpaFile(e){
      var thisS = this
      let file = e.target.files[0];

      var storage = firebase.storage();
      var storageRef = storage.ref();
      var imageRef = storageRef.child(thisS.state.name);
      var spaceRef = imageRef.child('ipa/app.ipa');
      var metadata = {
        contentType: 'application/octet-stream',
      };
      var x = spaceRef.put(file, metadata);
      x.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('ipa file Upload is ' + progress + '% done');
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        var downloadURL = x.snapshot.downloadURL;
        thisS.setState({
          ipaFileUrl: downloadURL
        })
        console.log("download", downloadURL)
      });
      
    }

    handleAddIcon(e) {
      console.log("add icon")
      var thisS = this
      // let reader = new FileReader();
      let file = e.target.files[0];
  
      // reader.onloadend = () => {
      //   thisS.setState({
      //     iconFile: file,
      //     imagePreviewUrl: reader.result
      //   });
      // }

      var storage = firebase.storage();
      var storageRef = storage.ref();
      var imageRef = storageRef.child(thisS.state.name);
      var spaceRef = imageRef.child('icon/icon.png');
      var metadata = {
        contentType: 'image/jpeg',
      };
      var x = spaceRef.put(file, metadata);

        x.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
          // Handle unsuccessful uploads
        }, function() {
          var downloadURL = x.snapshot.downloadURL;
          thisS.setState({
            imagePreviewUrl: downloadURL
          })
          console.log("download", downloadURL)
        });
  
      
    }
    

    render() {
      let {imagePreviewUrl} = this.state;
      return(
        <div>
          <h1>CreateNewAppPage</h1>
          <div>
        
        <div className="card-group" style={{width : '96px', height : '96px'}}>
  <img className="card-img-top" src={imagePreviewUrl}/>
</div>

        <SingleInput 
      
          inputType={'text'}
          title={'Full name'}
          name={'name'}
          controlFunc={this.handleNameChange}
          placeholder={'Type first and last name here'} 
        />

        <SingleInput 
        
          inputType={'text'}
          title={'version'}
          name={'version'}
          controlFunc={this.handleVersionChange}
          placeholder={'Type first and last name here'} 
        />

        
      <SingleInput 
        
        inputType={'text'}
        title={'build'}
        name={'build'}
        controlFunc={this.handleBuildChange}
        placeholder={'Type first and last name here'} 
      />

      
<SingleInput 
        
        inputType={'text'}
        title={'bundleId'}
        name={'bundleId'}
        controlFunc={this.handleBundleIdChange}
        placeholder={'Type first and last name here'} 
      />
          <SingleInput 
        inputType={'file'}
        title={'icon'}
        name={'icon'}
        controlFunc={this.handleAddIcon}
        placeholder={'Type first and last name here'} 
      />

<SingleInput 
        inputType={'file'}
        title={'.ipa file'}
        name={'fileApp'}
        controlFunc={this.handleIpaFile}
        placeholder={'Type first and last name here'} 
      />
          <button className="btn btn-primary" onClick={this.submitForm}>Submit form</button>


        
        </div>
        </div>
      )
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CreateNewAppPage);