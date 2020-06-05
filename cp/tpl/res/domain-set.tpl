<div id="incp-resdomain-set-alert"></div>

<div id="incp-resdomain-set-form" class="incp-form">

<table class="incp-formtable">

<tr>
  <td width="280px">Name</td>
  <td>
    <input type="text" class="form-control" name="meta_name" value="{[=it._name]}" disabled>
  </td>
</tr>

<tr>
  <td>Owner</td>
  <td>
    <input type="text" class="form-control" name="meta_user" value="{[=it.meta.user]}">
  </td>
</tr>

<tr>
  <td>Description</td>
  <td>
    <input type="text" class="form-control" name="description" value="{[=it.description]}">
  </td>
</tr>

<tr>
  <td>Let's Encrypt Enable</td>
  <td>
    <span class="incp-form-checkbox checkbox-inline">
      <input type="checkbox" name="option_letsencrypt_enable" value="on" 
      {[? inCp.ArrayLabelHas(it.options, "letsencrypt_enable", "on")]}checked="checked"{[?]}>
    </span>
  </td>
</tr>


</table

</div>
