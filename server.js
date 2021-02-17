var firebaseConfig = {
    apiKey: "AIzaSyC38rLxvuzvoCh5KrU9R6hg1oKdCOZP8a4",
    authDomain: "node-integration-dbf1f.firebaseapp.com",
    databaseURL: "https://node-integration-dbf1f.firebaseio.com",
    projectId: "node-integration-dbf1f",
    storageBucket: "node-integration-dbf1f.appspot.com",
    messagingSenderId: "388088783991",
    appId: "1:388088783991:web:6535d201d4b60aa4151272",
    measurementId: "G-31BS3CC9TQ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics;

firebase.auth.Auth.Persistence.LOCAL;

// -----------------------------functions--------------------------------------

function googleSignin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (data){
            window.location.href = 'main.html';
        })
        .catch(function(error){
            console.log(error);
        })
}

function resetForm(){

    $("#form")[0].reset();
    $("#selected-image").hide();
    $("#selected-video").hide();
    $("#upload-progress").html("Completed");
}

function deleteEventRecord(key)
{
    var Ref = firebase.database().ref().child("events").child(key);
    Ref.once('value').then(function(snapshot){
        var fileName = snapshot.val().name;
        firebase.storage().ref().child('files/'+fileName).delete().then(function(){
            console.log('deleted successfully');
        }).catch(function(error){
            console.log(error);
        });
    });

    return Ref.remove()
    .then(function()
    {
        console.log("Removed Successfully.");
    })
    .catch(function()
    {
        console.log("Error Occured.")
    });
}

function updateEventRecord(key){

    var Ref = firebase.database().ref().child("events").child(key);

    Ref.once('value').then(function(snapshot){

        var file = snapshot.val().file;
        var description = snapshot.val().desc;
        var time = snapshot.val().time;
        var date = snapshot.val().date;
        var name = snapshot.val().name;

        $('#hideThis').attr('style', 'display: inline;');
        $('#newPost').hide();
        if (file.search('mp4') === -1){
            $('#new-selected-image').attr('src', file);
            $('#new-selected-video').attr('style', 'display: none;');
        } else {
            $('#new-selected-video').attr('src', file);
            $('#new-selected-image').attr('style', 'display: none;');
        }
        
        $('#new_desc').val(description);
        $('#new_date').attr('value', date);
        $('#new_time').attr('value', time);
        $('#fileName').attr('value', name);
        $('#key').attr('value', key);
    });
}

function bookmarkEventRecord(key){
    var user = firebase.auth().currentUser;
    firebase.database().ref().child('users/'+user.uid).child('bookmarks').push(key).then(function(data){
        console.log(data);
    }).catch(function(error){
        console.log(error);
    })
}

function deleteBookmark(key){
    console.log(key)
    var user = firebase.auth().currentUser.uid;
    firebase.database().ref().child('users/'+user).child('bookmarks').child(key).remove().then(function(){
        console.log('removed bookmark');
    }).catch(function(error){
        console.log(error);
    });
}

// -----------------------------event listeners--------------------------------------

$('#btn-login').click(function(){
    var email = $('#email').val();
    var password = $('#password').val();

    if (email !== '' && password !== '') {
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        result.catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            window.alert('Message: ' + errorMessage);
        });
    } else {
        window.alert('Please fill out all fields');
    }
});

$('#btn-signup').click(function(){
    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var cPassword = $('#confirmPassword').val();

    if (email !== '' && password !== '' && cPassword !== '' && username !== '') {
        if (password === cPassword){
            var result = firebase.auth().createUserWithEmailAndPassword(email, password);
            result.catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                window.alert('Message: ' + errorMessage);
            });
        } else {
            window.alert('your passwords do not match');
        }
    } else {
        window.alert('Please fill out all fields');
    }
});

$('#btn-resetPassword').click(function(){
    var auth = firebase.auth();
    var email = $('#email').val();

    if (email !== ''){
        auth.sendPasswordResetEmail(email).then(function(){
            window.alert('Reset password link has been sent to your email id');
            window.location.href = 'auth.html'
        })
        .catch(function(error){
            console.log('errorrrrrrr');
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            window.alert('Message: ' + errorMessage);
        });
    } else {
        window.alert('required field is empty');
    }
});

$('#logout').click(function(){
    firebase.auth().signOut();
});

$('#btn-logout').click(function(){
    firebase.auth().signOut();
});

var validFileTypes = ["image/gif", "image/jpeg", "image/png", 'image/jpg', 'video/mp4'];

$('#hideThis').hide();

$('#file').change(function(){
    var file =  this.files[0];
    
    if (file) {
        var reader = new FileReader();

        reader.onload = (function(){
            if (file.type === 'video/mp4'){
                $('#selected-video').attr('src', this.result);
                $('#selected-video').attr('style', 'display: inline;');
            } else {
                $('#selected-image').attr('src', this.result);
                $('#selected-image').attr('style', 'display: inline;');
            }
        });
        reader.readAsDataURL(file);
    }
});

$('#new-file').change(function(){
    var file =  this.files[0];
    
    if (file) {
        var reader = new FileReader();

        reader.onload = (function(){
            if (file.type === 'video/mp4'){
                $('#new-selected-video').attr('src', this.result);
                $('#new-selected-image').attr('style', 'display: none;');
                $('#new-selected-video').attr('style', 'display: inline;');
            } else {
                $('#new-selected-image').attr('src', this.result);
                $('#new-selected-video').attr('style', 'display: none;');
                $('#new-selected-image').attr('style', 'display: inline;');
            }
        });
        reader.readAsDataURL(file);
    }
});

$('#button').click(function(){

    var desc = $("#desc").val();
    var date = $("#date").val();
    var time = $("#time").val();
    var file = $("#file").prop("files")[0];

    if(file == null){
        window.alert('no file found');
        return;
    }

    if(!desc){

        window.alert('no description found');
        return;
    }

    if(!date || !time){

        window.alert('no date/time found');
        return;
    }

    if($.inArray(file["type"], validFileTypes)<0){

        window.alert('image type is invalid');
        return;
    }

    var databaseRef = firebase.database().ref();
    var user = firebase.auth().currentUser;
    databaseRef.child('users/'+user.uid).child('username').once("value").then(function(snapshot){

        var username = snapshot.val();
        var name = file["name"];
        var dateStr = new Date().getTime();
        var fileCompleteName = name + "_" + dateStr;

        var storageRef = firebase.storage().ref("files");
        var eventStorageRef = storageRef.child(fileCompleteName);

        var uploadTask = eventStorageRef.put(file);


        uploadTask.on("state_changed",
            
            function progress(snapshot)
            {
                var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                $("#upload-progress").html(Math.round(percentage) + "%");
                $("#upload-progress").attr("style", "width:" + percentage + "%");

            },
            function error(err)
            {
                if (err){
                    console.log(err);
                }
            },
            function complete()
            {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadUrl)
                {

                    var eventsData = 
                    {
                        "file": downloadUrl,
                        "username": username,
                        'uid': user.uid,
                        "desc": desc,
                        "counter": 5000 - counter,
                        "time": time,
                        "date": date,
                    };

                    var newPostRef = databaseRef.child('events').push();

                    newPostRef.set(eventsData, function(err)
                    {
                        if(err)
                        {
                            console.log(err.message);
                        }
                        else
                        {
                            console.log('success');

                            window.open("", "_self");
                        }
                        resetForm();
                    });
                });
            }
        );
    });
});

$('#new-button').click(function(){
    var new_desc = $("#new_desc").val();
    var new_date = $("#new_date").val();
    var new_time = $("#new_time").val();
    var delete_name = $("#fileName").val();
    var key = $("#key").val();
    var new_file = $("#new-file").prop("files")[0];

    if(new_file == null){
        window.alert('no image found');
        return;
    }

    if(!new_desc){

        window.alert('no description found');
        return;
    }

    if(!new_date || !new_time){

        window.alert('no date/time found');
        return;
    }

    if($.inArray(new_file["type"], validFileTypes)<0){

        window.alert('image type is invalid');
        return;
    }

    firebase.storage().ref().child('files/'+delete_name).delete().then(function(){
        console.log('deleted successfully');
    }).catch(function(error){
        console.log(error);
    });

    
    var new_name = new_file["name"];
    var dateStr = new Date().getTime();
    var new_fileCompleteName = new_name + "_" + dateStr;

    firebase.storage().ref('files').child(new_fileCompleteName).put(new_file).on('state_changed',
    function progress(snapshot)
    {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        $("#new-upload-progress").html(Math.round(percentage) + "%");
        $("#new-upload-progress").attr("style", "width:" + percentage + "%");

    },
    function error(err)
    {
        if (err){
            console.log(err);
        }
    },
    function complete()
    {
        firebase.storage().ref('files').child(new_fileCompleteName).put(new_file).snapshot.ref.getDownloadURL().then(function(downloadUrl)
        {

            var new_eventsData = 
            {
                "file": downloadUrl,
                "name": new_fileCompleteName,
                "desc": new_desc,
                "time": new_time,
                "date": new_date,
            };

            return firebase.database().ref().child('events').child(key).update(new_eventsData).then(function(){
                console.log('successfully updated');
            }).catch(function(err){
                console.log(err);
            });
        });
    });
});