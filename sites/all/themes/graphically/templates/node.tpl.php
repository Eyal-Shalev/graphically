<?php
hide($content['comments']);
hide($content['links']);
?>
<article id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>">

  <?php if ($title_prefix || $title_suffix || $display_submitted || !$page && $title): ?>
    <?php print render($title_prefix); ?>
    <?php if (!$page && $title): ?>
      <h2<?php print $title_attributes; ?>><?php print $title; ?></h2>
    <?php endif; ?>
    <?php print render($title_suffix); ?>
  <?php endif; ?>

  <?php print render($content); ?>
</article>