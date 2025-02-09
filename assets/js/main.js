/**
 * Main Script for menu by user roles
 *
 * @package MenuByUserRoles
 */

jQuery(document).ready(function ($) {
  // Load select2 for user roles dropdown
  setTimeout(function () {
    $(".menuby-user-roles-dropdown").select2({
      multiple: true,
    });
  }, 500);
});
