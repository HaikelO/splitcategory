document.addEventListener("DOMContentLoaded", (event) => {
  var isTreeDepthLimitation = false;
  var treeDepth = 0;
  var originalSelect;
  var select2;
  var container = $("<div></div>").css({
    display: "flex",
    flexDirection: "column",
    width: "100%",
  });

  var observerCallback = function (mutationsList, observer) {
    if (
      document.querySelector(
        '[aria-labelledby^="select2-dropdown_itilcategories_id"]'
      ) &&
      document.querySelector('select[name="itilcategories_id"]')
    ) {
      originalSelect = $('select[name="itilcategories_id"]');
      select2 = $('[aria-labelledby^="select2-dropdown_itilcategories_id"]');
      if (originalSelect.length > 0 && select2.length > 0) {
        //Destroy the observer
        observer.disconnect();

        //Add the container that will hold Dropdowns
        originalSelect.after(container);

        fetchCategories();

        //Hide the old the dropdown
        select2.parent().parent().hide();
      }
    }
  };

  var observer = new MutationObserver(observerCallback);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributeOldValue: true,
    attributes: true,
  });

  // Function to populate select with options and handle nested subcategories
  function populateSelect(select, categories, parentId, depth, chain) {
    if (depth < treeDepth || !isTreeDepthLimitation) {
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
          populateSelect(container, categories, selectedId, depth + 1, chain); // Recursive call
        });

      // Default option
      newSelect.append($("<option>").val("").text("Select an option"));

      // Populate new select
      relevantCategories.forEach(function (cat) {
        newSelect.append($("<option>").val(cat.id).text(cat.name));
      });

      select.append(newSelect);

      if (chain.length > 0 && chain.length > depth) {
        newSelect.val(chain[depth]);
        populateSelect(container, categories, chain[depth], depth + 1, chain);
      }
    }
  }

  // Fetch categories and initialize the top-level dropdown
  async function fetchCategories() {
    $.ajax({
      url:
        CFG_GLPI.root_doc +
        "/" +
        GLPI_PLUGINS_PATH.splitcategory +
        "/ajax/getitilcategories.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (Array.isArray(data) && data.length > 0) {
          var currentValue = originalSelect.val();
          var chain = findHierarchyPath(data, currentValue);
          populateSelect(container, data, 0, 0, chain); // Assuming '0' is the parentId for top-level categories

          return data;
        } else {
          console.error("Data fetched is not an array or is empty.");
        }
      },
      error: function (xhr, status, error) {},
    });
  }

  function findHierarchyPath(data, childId) {
    console.log("data", data);

    // Function to find the category by ID
    function findById(data, id) {
      let category = data.find((item) => item.id == id);
      return category;
    }

    // Recursive function to trace the path
    function tracePath(data, currentId) {
      const currentItem = findById(data, currentId);
      if (!currentItem || currentItem.itilcategories_id == 0) {
        return currentItem ? [currentItem] : [];
      }
      return [...tracePath(data, currentItem.itilcategories_id), currentItem];
    }

    return tracePath(data, childId).map((item) => item.id);
  }
});
