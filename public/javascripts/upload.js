$(document).ready(function() {
    status('Select a file to upload.');

    // Check to see when a user has selected a file                                                                                                                
    var timerId;
    timerId = setInterval(function() {
        if($('#userPhotoInput').val() !== '') {
            clearInterval(timerId);

            $('#uploadForm').submit();
        }
    }, 500);

    $('#uploadForm').submit(function() {
        status('Uploading file ...');

        $(this).ajaxSubmit({                                                                                                                 
            error: function(xhr) {
                status('Error: ' + xhr.status);
            },

            success: function(response) {
                status('Upload complete!');
            }
        });
        return false;
    });

    function status(message) {
        $('#status').text(message);
    }
});
