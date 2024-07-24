$(document).ready(function () {
  var pluginPath = "../plugins/splitcategory/ajax/getitilcategories.php";

  var originalSelect = $('select[name="itilcategories_id"]');
  var select2 = $('[aria-labelledby^="select2-dropdown_itilcategories_id"]');
  var container = $("<div></div>").css({
    display: "flex",
    flexDirection: "column",
    width: "100%",
  });
  originalSelect.after(container);

  // Function to populate select with options and handle nested subcategories
  function populateSelect(select, categories, parentId, depth) {
    if (depth < 3) {
      var relevantCategories = categories.filter(
        (cat) => cat.itilcategories_id == parentId
      );

      if (relevantCategories.length === 0) {
        return; // No subcategories, stop recursion
      }

      var newSelect = $("<select></select>", {
        id: "category" + depth + 1,
        name: "itilcategories_id",
      })
        .css({
          marginTop: depth == 0 ? "0px" : "10px",
        })
        .on("change", function () {
          $(this).nextAll("select").remove(); // Remove old child dropdowns
          var selectedId = $(this).val();
          populateSelect(container, categories, selectedId, depth + 1); // Recursive call
        });

      // Default option
      newSelect.append($("<option>").val("").text("Select an option"));

      // Populate new select
      relevantCategories.forEach(function (cat) {
        newSelect.append($("<option>").val(cat.id).text(cat.name));
      });

      select.append(newSelect);
    }
  }

  // Fetch categories and initialize the top-level dropdown
  function fetchCategories() {
    $.ajax({
      url: pluginPath,
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (Array.isArray(data) && data.length > 0) {
          populateSelect(container, data, 0, 0); // Assuming '0' is the parentId for top-level categories
        } else {
          console.error("Data fetched is not an array or is empty.");
        }
      },
      error: function (xhr, status, error) {},
    });
  }

  fetchCategories();

  //Hide the old the dropdown
  select2.parent().parent().hide();
});
