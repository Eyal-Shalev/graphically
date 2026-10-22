<?php

/**
 * @file
 * Default simple view template to display a list of rows.
 *
 * @ingroup views_templates
 */
?>
<?php if ($description): ?>
  <div<?php if ($classes_array['desc']) { print ' class="' . $classes_array['desc'] .'"';  } ?>>
    <?php print $description; ?>
  </div><!--/ column #0 -->
<?php endif; ?>
<?php foreach ($rows as $id => $row): ?>
  <div<?php if ($classes_array[$id]) { print ' class="' . $classes_array[$id] .'"';  } ?>>
    <?php print $row; ?>
  </div><!--/ column #<?=$id+1?> -->
<?php endforeach; ?>
