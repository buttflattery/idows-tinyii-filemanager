/**
 * Tinyii idowsFileBrowser - a TinyMCE File Manager Plugin for Yii 1.x
 * @License: MIT License
 * @Plugin info: TinyMCE filemanager plugin to be used with Yii 1.x 
 * or as a standalone filemanager without TinyMCE Editor in Yii 1.x
 * @Author: Muhammad Omer Aslam<buttflattery@gmail.com>
 * @url: https://plugins.idowstech.com
 * @Version: 1.0
 */

var idowsForms = new function() {
    'use strict';

    //submit for 
    this.submitForm = function(form, data, hasError) {
        if (!hasError) {
            // No errors! Do your post and stuff
            $.post(form.attr('action'), form.serialize(), function(res) {
                // Do stuff with your response data!
                let response = $.parseJSON(res);
                idowsForms.displayMessage(response.message, response.success);
            });
        }
        // Always return false so that Yii will never do a traditional form submit
        return false;
    };

    this.displayMessage = (message, type) => {
        let messageType = (type ? 'success' : 'error');

        //flash success message
        $('#content').prepend('<div class="flash-' + messageType + '">' + message + '</div>');

        //flash success message
        $(".flash-" + messageType).animate({
            opacity: 1.0
        }, 3000).fadeOut("slow");

        (typeof idowsFileBrowser !== 'undefined') && idowsFileBrowser.reloadView();
    };
    this.basename = (path) => {
        return path.replace(/\/+$/, "").replace(/.*\//, "");
    };
}