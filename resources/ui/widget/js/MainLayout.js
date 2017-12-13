define([
    "dojo/_base/declare",
    "dojo/dom",
    "dojo/topic",
    "./MainDataStore",
    "./SelectRegisteredGitRepository",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Dialog",
    "dijit/form/TextBox",
    "dijit/form/Button",
    "dojo/text!../templates/MainLayout.html"
], function (declare, dom, topic,
    MainDataStore, SelectRegisteredGitRepository,
    _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
    Dialog, TextBox, Button, template) {
    return declare("com.siemens.bt.jazz.workitemeditor.rtcGitConnector.ui.widget.mainLayout",
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],
    {
        templateString: template,

        constructor: function () {
        },

        startup: function () {
            console.log("mainDataStore from startup", MainDataStore);
            var handle = topic.subscribe("rtcGitConnector/workItem", function (workItem) {
                console.log("got workItem", workItem);
                handle.remove();
            });
            this.watchDataStore();
            this.setEventHandlers();
        },

        watchDataStore: function () {
            var self = this;

            var handle = MainDataStore.registeredGitRepositories.watchElements(function () {
                self.selectRegisteredGitRepository.setRegisteredGitRepositoriesAsListOptions(MainDataStore.registeredGitRepositories);
                handle.unwatch(); // need to do this because the datastore instance is perssistant. it should be recreated together with the widget...
            });

            MainDataStore.selectedRepositorySettings.watch("repository", function (name, oldValue, value) {
                dom.byId("selectedRegisteredGitRepositoryContainer").innerHTML = value
                    ? value.name || value
                    : "No git repository selected";
            });
        },

        setEventHandlers: function () {
            var self = this;
            var originalOnChangeFunction = this.selectRegisteredGitRepository.selectRegisteredGitRepository.onChange;

            this.selectRegisteredGitRepository.selectRegisteredGitRepository.onChange = function (value) {
                originalOnChangeFunction.call(this, value);

                MainDataStore.selectedRepositorySettings.set("repository", MainDataStore.registeredGitRepositories.find(function (element) {
                    return element.key === value;
                }));
            };

            var repositoriesFromSomewhere = [{
                key: "123",
                name: "Git Commit Picker",
                url: "https://github.com/jazz-community/rtc-git-commit-picker"
            },
            {
                key: "456",
                name: "rtc-secure-user-property-store",
                url: "https://github.com/jazz-community/rtc-secure-user-property-store"
            },
            {
                key: "789",
                name: "rtc-create-child-item-plugin",
                url: "https://github.com/jazz-community/rtc-create-child-item-plugin"
            }];

            repositoriesFromSomewhere.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            this.buttonWidget.onClick = function (event) {
                MainDataStore.registeredGitRepositories.push.apply(MainDataStore.registeredGitRepositories, repositoriesFromSomewhere);

                this.setDisabled(true);
            };

            this.showDialogButton.onClick = function (event) {
                self.myDialog.show();
            };

            this.submitDialogButton.onClick = function (event) {
                self.myDialog.hide();
            };

            this.cancelDialogButton.onClick = function (event) {
                self.myDialog.hide();
            };
        }
    });
});