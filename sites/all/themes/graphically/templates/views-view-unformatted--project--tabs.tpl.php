<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<?php foreach ($rows as $id => $row): ?>
  <div<?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>>
    <?php print $row; ?>
    <?php if (isset($active_tab_id) && $active_tab_id == $id): ?>
      <?php print render($nav); ?>
    <?php endif;?>
  </div>
<?php endforeach;