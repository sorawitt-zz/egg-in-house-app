import React from 'react'
import withAuthorization from './withAuthorization';
import PropTypes from 'prop-types';
import SingleInput from './SingleInput';
import ProgressBar from './ProgressBar';
import { auth, db } from '../firebase';
import firebase from 'firebase';

class UpdateAppModel extends React.Component {
    state = {
        iconApp: this.props.appIcon,
        nameApp: this.props.nameApp,
        version: this.props.version,
        bundleId: this.props.bundleId,
        build: this.props.build,
        description: this.props.description,
        ipaFile: undefined,
        ipaFileUrl: undefined,
        downloadProgress: undefined
    }
    
    componentWillMount(){
        var id = this.props.params.id;
        console.log("name id", id)
        console.log("name", this.props.nameApp)


    }

    componentDidMount(){
        console.log("didMount", this.state.nameApp)
    }

    handleNameChange = (e) => {
        this.setState({
            nameApp: e.target.value
        })
    }

    handleVersionChange = (e) => {
        this.setState({
            version: e.target.value
        })
    }

    handleBuildChange = (e) => {
        this.setState({
            build: e.target.value
        })
    }

    handleBundleIdChange = (e) => {
        this.setState({
            bundleId: e.target.value
        })
    }

    handleIpaFile = (e) => {
        let file = e.target.files[0];
        this.setState({
            ipaFile: file
        })
    }

    onDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    submitForm = (e) => {
        e.preventDefault();
        var thiss = this
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var ipaRef = storageRef.child(this.state.nameApp).child('ipa/app.ipa');
        var fileIpaRaw = this.state.ipaFile
        var metadata = {
            contentType: 'application/octet-stream',
        };
        var uploadX = ipaRef.put(fileIpaRaw, metadata);
        uploadX.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            thiss.setState({
                downloadProgress: progress
            })
        }, function (error) {
            // Handle unsuccessful uploads
        }, function () {
            var downloadURL = uploadX.snapshot.downloadURL;
            thiss.setState({
                ipaFileUrl: downloadURL
            })
            console.log("download", downloadURL)
            thiss.handleWritePlistFile()


        });
    }

    handleWritePlistFile = () => {
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
    xw.text(this.state.ipaFileUrl)   // <--- input url for .ipa file
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
    xw.text(this.state.bundleId)  // <--- input bundle id
    xw.endElement()
    xw.startElement("key")
    xw.text("bundle-version")
    xw.endElement()
    xw.startElement("string")
    xw.text(this.state.version) // <--- input bundle id
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
    xw.text(this.state.nameApp) // <--- input title here
    xw.endElement()
    xw.endDocument();
    this.setState({
      maniFestPlist: xw
    })
    this.saveManiFestPlistToStorage()

    }

    saveManiFestPlistToStorage = () => {
        var thiss = this
        var manifestFile = this.state.maniFestPlist
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var manifestRef = storageRef.child(this.state.nameApp).child('ipa/manifest.plist');
        var file = new Blob([manifestFile.toString()], { type: 'application/octet-stream'});
        var GoogleURL = require( 'google-url' );
        var googleUrl = new GoogleURL( { key: 'AIzaSyCUq7yUP6JvRYfVkD5RnUlVrtuZcD9lsPI' });

        var uploadManifestRef = manifestRef.put(file).then(function(snapshot){
          var downloadURL = snapshot.downloadURL;
          googleUrl.shorten( downloadURL, function( err, shortUrl ) {
            console.log("url", shortUrl)
            thiss.setState({
              appFile: shortUrl
            })
            thiss.handleSaveDataToDB()
          });
        })
    }

    handleSaveDataToDB = () => {
        var dbb = firebase.database();

        dbb.ref(`Applications/${this.state.nameApp}`).set({
          name: this.state.nameApp,
          fileAppUrl: this.state.appFile,
          //appIconUrl: this.state.appIconUrl,
         // group_access: {General : true},
          description: this.state.description,
          //device: "iPhone",
          lastest_timestamp: 15232323.2212,
         // screenshots: {img1: "url", img2 : "url2"},
         // timeStamp: 15232323.2212,
          version: this.state.version,
         // download: 0,
          build: this.state.build,
          bundleId: this.state.bundleId
        })
    }




    render() {
        return (

            <div>

                Hello
             <h1>Update Application</h1>
                <div className="card-group" style={{ width: '96px', height: '96px' }}>
                    <img className="card-img-top" src={this.state.appIcon} />
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

                    <button className="btn btn-primary" disabled={false} >Submit form</button>


                </form>
            </div>

        )
    }

}

UpdateAppModel.propTypes = {
    appIcon: PropTypes.string,
    nameApp: PropTypes.string,
    version: PropTypes.string,
    bundleId: PropTypes.string,
    build: PropTypes.string,
    description: PropTypes.string

}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(UpdateAppModel);