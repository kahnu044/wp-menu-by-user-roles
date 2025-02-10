(function (wp) {
  const { addFilter } = wp.hooks;
  const { createHigherOrderComponent } = wp.compose;
  const { InspectorControls } = wp.blockEditor || wp.editor;
  const { PanelBody, FormTokenField } = wp.components;

  /**
   * Adds a custom attribute `userRoleVisibility` to the Navigation Link block.
   * This attribute stores the selected user roles for menu item visibility.
   *
   * @param {Object} settings - The block settings.
   * @param {string} name - The block name.
   * @returns {Object} The modified block settings with the new attribute.
   */
  function mburAddUserRoleVisibilityAttributes(settings, name) {
    if (name !== "core/navigation-link") {
      return settings;
    }

    settings.attributes.userRoleVisibility = {
      type: "array",
      default: [],
    };

    return settings;
  }

  // Register the custom attribute for the Navigation Link block
  addFilter(
    "blocks.registerBlockType",
    "mbur/navigation-link-visibility",
    mburAddUserRoleVisibilityAttributes
  );

  /**
   * Adds a multi-select field for role-based visibility inside the block settings sidebar.
   * This field allows users to choose which user roles can see the menu item.
   *
   * @param {Function} BlockEdit - The original block edit component.
   * @returns {Function} The enhanced block edit component with the new setting.
   */
  const mburWithInspectorControls = createHigherOrderComponent((BlockEdit) => {
    return function (props) {
      if (props.name !== "core/navigation-link") {
        return wp.element.createElement(BlockEdit, props);
      }

      const { attributes, setAttributes } = props;
      const { userRoleVisibility = [] } = attributes;

      return wp.element.createElement(
        wp.element.Fragment,
        {},
        wp.element.createElement(BlockEdit, props),
        wp.element.createElement(
          InspectorControls,
          {},
          wp.element.createElement(
            PanelBody,
            { title: "Menu Visibility" },
            wp.element.createElement(FormTokenField, {
              label: "Choose User Roles",
              value: userRoleVisibility.map((role) => {
                const foundRole = mburData.userRoles.find(
                  (r) => r.value === role
                );
                return foundRole ? foundRole.label : role;
              }),
              suggestions: mburData.userRoles.map((role) => role.label),
              onChange: (newRoles) => {
                const roleValues = newRoles.map((label) => {
                  const foundRole = mburData.userRoles.find(
                    (r) => r.label === label
                  );
                  return foundRole ? foundRole.value : label;
                });

                setAttributes({ userRoleVisibility: roleValues });

                // Close suggestions by temporarily shifting focus
                setTimeout(() => document.activeElement.blur(), 100);
              },
              __experimentalExpandOnFocus: true,
              __nextHasNoMarginBottom: true,
            })
          )
        )
      );
    };
  }, "mburWithInspectorControls");

  // Register the enhanced block edit component
  addFilter(
    "editor.BlockEdit",
    "mbur/navigation-link-visibility-control",
    mburWithInspectorControls
  );
})(window.wp);
