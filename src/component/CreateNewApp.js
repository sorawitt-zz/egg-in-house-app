import React, { Component } from 'react';
import withAuthorization from './withAuthorization';
import { auth, db } from '../firebase';
import icon from '../icon.png'
import SingleInput from './SingleInput';
import firebase from 'firebase';
import ProgressBar from './ProgressBar';
import LaunchModal from './LaunchModal';
import { Route, Redirect } from 'react-router';
import { LIST_APP } from '../constants/routes';


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
      appFile: "",
      description: "desc",
      screenshots: {img1: "url"},
      timeStamp: 1519202581.858228,
      lastest_timestamp: 1519202581.858228,
      device: "iPhone",
      ipaFile: "",
      maniFestPlist: "",
      downloadProgress: 0,
      downloadState: 0,
      uploadFilename: "filename",
      success: false
    
    }

    this.handleAddIcon = this.handleAddIcon.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleBuildChange = this.handleBuildChange.bind(this)
    this.handleBundleIdChange = this.handleBundleIdChange.bind(this)
    this.handleVersionChange = this.handleVersionChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.handleIpaFile = this.handleIpaFile.bind(this)
    this.handleSaveDataToDB = this.handleSaveDataToDB.bind(this)
    this.saveIpaFileToStorage = this.saveIpaFileToStorage.bind(this)
    this.handleWritePlistFile = this.handleWritePlistFile.bind(this)
    this.saveManiFestPlistToStorage = this.saveManiFestPlistToStorage.bind(this)
    
  }

  componentWillMount(){
    console.log("willMount")

  }

  handleWritePlistFile(){
    var thisS = this
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
    thisS.setState({
      maniFestPlist: xw
    })
    this.saveManiFestPlistToStorage()



  }

  saveManiFestPlistToStorage(){
    // SemiFinal step
    var thisS = this
    var manifestFile = thisS.state.maniFestPlist
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imageRef = storageRef.child(thisS.state.name);
    var spaceRef = imageRef.child('ipa/manifest.plist');
    var file = new Blob([manifestFile.toString()], { type: 'application/octet-stream'});
    var GoogleURL = require( 'google-url' );
    var googleUrl = new GoogleURL( { key: 'AIzaSyCUq7yUP6JvRYfVkD5RnUlVrtuZcD9lsPI' });

    //console.log("xw", xw.toString())
    var uploadManifestRef = spaceRef.put(file).then(function(snapshot){
      var downloadURL = snapshot.downloadURL;
      googleUrl.shorten( downloadURL, function( err, shortUrl ) {
        console.log("url", shortUrl)
        thisS.setState({
          appFile: shortUrl
        })
        thisS.handleSaveDataToDB()
      });
    })
  }

  submitForm(event) {
    var thisS = this
    console.log("touch")
    thisS.setState({
      success: true
    })
    //var fileIpaRaw  = thisS.state.fileIpa
    // thisS.setState({
    //   downloadState: 50
    // })
    // this.saveIpaFileToStorage();
    // //this.handleIpaFile
    // // console.log(JSON.stringify(thiss.state))

    event.preventDefault();
  }

  handleClearForm(e) {
    e.preventDefault();
  }


  handleSaveDataToDB(){
    //Final step
    var thisS = this
    var dbb = firebase.database();

    dbb.ref(`Applications/${thisS.state.name}`).set({
      name: thisS.state.name,
      fileAppUrl: thisS.state.appFile,
      appIconUrl: thisS.state.imagePreviewUrl,
      group_access: {General : true},
      description: thisS.state.description,
      device: thisS.state.device,
      lastest_timestamp: thisS.state.lastest_timestamp,
      screenshots: thisS.state.screenshots,
      timeStamp: thisS.state.timeStamp,
      version: thisS.state.version,
      download: 0,
      build: thisS.state.build,
      bundleId: thisS.state.bundleId
    })

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

  saveIpaFileToStorage(){
    var thisS = this
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imageRef = storageRef.child(thisS.state.name);
    var fileIpaRaw = thisS.state.ipaFile
    var spaceRef = imageRef.child('ipa/app.ipa');
    var metadata = {
      contentType: 'application/octet-stream',
    };
    var x = spaceRef.put(fileIpaRaw, metadata);
    x.on('state_changed', function(snapshot){
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('ipa file Upload is ' + progress + '% done');
      thisS.setState({
        downloadProgress: progress
      })
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      var downloadURL = x.snapshot.downloadURL;
      thisS.setState({
        ipaFileUrl: downloadURL
      })
      console.log("download", downloadURL)
      thisS.handleWritePlistFile()

      
    });
  }

  handleIpaFile(e){
    //var thisS = this
    let file = e.target.files[0];
    this.setState({
      ipaFile: file
    })

  }

  handleAddIcon(e) {
    console.log("add icon")
    var thisS = this
    // let reader = new FileReader();
    let file = e.target.files[0];

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
      thisS.setState({
        downloadProgress: progress
      })
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      }
    }, function(error) {
      
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
    if(this.state.success) {
      return(

    <Redirect to={LIST_APP}/>
      )
    }
    return(
      <div>
        <h1>CreateNewAppPage</h1>
      <div>

      <div className="card-group" style={{width : '96px', height : '96px'}}>
        <img className="card-img-top" src={imagePreviewUrl}/>
      </div>
      <form onSubmit={this.submitForm}>

        <SingleInput
        inputType={'text'}
        title={'Full name'}
        name={'name'}
        controlFunc={this.handleNameChange}
        placeholder={'Type first and last name here'}
        required={'true'}
        />

        <SingleInput
        inputType={'text'}
        title={'version'}
        name={'version'}
        controlFunc={this.handleVersionChange}
        placeholder={'Type first and last name here'}
        required={'true'}
        />


        <SingleInput
        inputType={'text'}
        title={'build'}
        name={'build'}
        controlFunc={this.handleBuildChange}
        placeholder={'Type first and last name here'}
        required={'true'}
        />


      <SingleInput
      inputType={'text'}
      title={'bundleId'}
      name={'bundleId'}
      controlFunc={this.handleBundleIdChange}
      placeholder={'Type first and last name here'}
      required={'true'}
      />
      <SingleInput
      inputType={'file'}
      title={'icon'}
      name={'icon'}
      //controlFunc={this.handleAddIcon}
      placeholder={'Type first and last name here'}
      required={'true'}
      />

      <SingleInput
      inputType={'file'}
      title={'.ipa file'}
      name={'fileApp'}
      controlFunc={this.handleIpaFile}
      placeholder={'Type first and last name here'}
      required={'true'}
      />

      <SingleInput
      inputType={'text'}
      title={'description'}
      name={'descritpion'}
      controlFunc={this.onDescriptionChange}
      placeholder={'typing...'}
      required={'true'}
      />

      <button className="btn btn-primary"  disabled={false} >Submit form</button>
      
      </form>

      <ProgressBar
      title={this.state.uploadFilename}
      name={'uploadBar'}
      downloadProgress={this.state.downloadProgress}
      />

      { this.state.success == true &&
        <LaunchModal
        title={'Upload process'}
        msg={'Success!'+this.state.appFile}
        />
        
      }
      
      </div>
      </div>
    )
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(CreateNewAppPage);