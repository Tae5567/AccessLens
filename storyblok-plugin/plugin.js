// storyblok-plugin/plugin.js
(function () {
  const plugin = {
    // Plugin initialization
    init(pluginApi) {
      console.log("AccessLens plugin initialized");

      // Register toolbar button
      pluginApi.registerButton({
        id: "accesslens-button",
        name: "AccessLens",
        icon: "accessibility",
        tooltip: "Open Accessibility Preview",
        action: () => {
          this.openAccessLens(pluginApi);
        },
      });

      // Listen for content changes
      pluginApi.on("contentChanged", (data) => {
        console.log("Content changed:", data);
      });
    },

    // Open AccessLens in modal
    openAccessLens(pluginApi) {
      const storyId = pluginApi.getStoryId();
      const storySlug = pluginApi.getStory().full_slug;

      // Open AccessLens in a modal
      pluginApi.openModal({
        url: `${process.env.ACCESSLENS_URL}/preview?story=${storySlug}`,
        width: "100%",
        height: "100%",
        title: "AccessLens - Accessibility Preview",
      });
    },
  };

  // Register plugin
  if (window.storyblok) {
    window.storyblok.registerPlugin(plugin);
  }
})();