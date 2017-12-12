define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/form/Select",
    "dojo/text!../templates/SelectRegisteredGitRepository.html"
], function (declare, _WidgetBase, _TemplateMixin, _WidgetsInTemplateMixin, Select, template) {
    return declare("com.siemens.bt.jazz.workitemeditor.rtcGitConnector.ui.widget.selectRegisteredGitRepository",
        [_WidgetBase, _TemplateMixin, _WidgetsInTemplateMixin],
    {
        templateString: template,
        selectListOptions: null,

        constructor: function () {
            this.selectListOptions = [{
                value: "",
                label: this.createLabelString("&nbsp;", "Loading..."),
                selected: true,
                disabled: true
            }, {
                value: "123",
                label: this.createLabelString("Test repository name", "the url to the repository 1234 asdfg 234  asdf asdf")
            }];
        },

        postCreate: function () {
            this.initializeSelectList();
        },

        initializeSelectList: function () {
            this.selectRegisteredGitRepository.set("options", this.selectListOptions);
            this.selectRegisteredGitRepository.startup();
            this.selectRegisteredGitRepository.maxHeight = -1;
            this.selectRegisteredGitRepository.onChange = function (value) {
                if (this.options[0].value === "") {
                    this.removeOption(this.options[0]);
                }
            }
        },

        createLabelString: function (firstLine, secondLine) {
            return '<span class="rtcGitConnectorSelectListSpan rtcGitConnectorSelectListFirstLine">' + firstLine + '</span>' +
                    '<span class="rtcGitConnectorSelectListSpan rtcGitConnectorSelectListSecondLine">' + secondLine + '</span>';
        }
    });
});