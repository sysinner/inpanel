<style>
#inops-podspec-planset .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 100%;
}
#inops-podspec-planset button.icon-x20 {
  padding: 0px;
  width: 22px;
  height: 22px;
  font-size: 11px;
  text-align: center;
}
#inops-podspec-planset th {
  font-weight: normal;
}
#inops-podspec-planset .card-body {
  padding: 0 10px;
}
</style>

<div id="inops-podspec-planset-alert"></div>
<div id="inops-podspec-planset" class="incp-div-light" style="box-sizing: border-box;">loading</div>

<script type="text/html" id="inops-podspec-planset-tpl">

<div class="card" id="inops-podspec-planset">
<div class="card-header">Plan Setting</div>
<div class="card-body" id="inops-podspec-planset-info">

<table class="incp-formtable">
<tbody>

<tr>
  <td>ID</td>
  <td></td>
  <td>
    <input type="text" class="form-control" name="plan_meta_id" value="{[=it.meta.id]}" {[? it.meta.id.length > 0]}readonly{[?]}>
  </td>
</tr>

<tr>
  <td width="200px">Name</td>
  <td width="30px"></td>
  <td>
    <input type="text" class="form-control" name="plan_meta_name" value="{[=it.meta.name]}">
  </td>
</tr>

<!--
<tr>
  <td>Labels</td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetLabelAppend()">
      <span class="fa fa-plus"></span>
    </button>
  </td>
  <td>
    <table>
      <thead>
        <tr>
          <th width="50%">Name (ex. namespace/module/name, ...)</th>
          <th>Value</th>
          <th width="30px"></th>
        <tr>
      </thead>
      <tbody id="inops-podspec-planset-labels">
        {[~it.labels :vl]}
        <tr class="inops-podspec-planset-label-item">
          <td>
            <input name="label_name" type="text" value="{[=vl.name]}" class="form-control input-sm">
          </td>
          <td>
            <input name="label_value" type="text" value="{[=vl.value]}" class="form-control input-sm">
          </td>
          <td align="right">
            <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetLabelDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>

<tr>
  <td>Annotations</td>
  <td>
    <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetAnnotationAppend()">
      <span class="fa fa-plus"></span>
    </button>
  </td>
  <td>
    <table>
      <thead>
        <tr>
          <th width="50%">Name (ex. namespace/module/name, ...)</th>
          <th>Value</th>
          <th width="30px"></th>
        <tr>
      </thead>
      <tbody id="inops-podspec-planset-annotations">
        {[~it.annotations :vl]}
        <tr class="inops-podspec-planset-annotation-item">
          <td>
            <input name="annotation_name" type="text" value="{[=vl.name]}" class="form-control input-sm">
          </td>
          <td>
            <input name="annotation_value" type="text" value="{[=vl.value]}" class="form-control input-sm">
          </td>
          <td align="right">
            <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetAnnotationDel(this)">
              <i class="fa fa-times"></i>
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </td>
</tr>
-->

<tr>
  <td>Zone / Cluster</td>
  <td></td>
  <td class="incp-form-box-selector">
    {[~it._zones.items :v]}
    {[~v.cells :vc]}
    <div class="incp-form-box-selector-item {[if (vc._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-zone-id-{[=v.meta.id]}-{[=vc.meta.id]}"
      onclick="inOpsPod.SpecPlanSetClusterChange('{[=v.meta.id]}', '{[=vc.meta.id]}')">
      <div>{[=v.meta.id]}</div>
      <div>{[=vc.meta.id]}</div>
    </div>
    {[~]}
    {[~]}
  </td>
</tr>

<tr>
  <td>CPU / RAM</td>
  <td></td>
  <td class="incp-form-box-selector">
    {[~it._rescomputes.items :v]}
    <div class="incp-font-fixspace incp-form-box-selector-item {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-res-compute-id-{[=v.meta.id]}"
      onclick="inOpsPod.SpecPlanSetResComputeChange('{[=v.meta.id]}')">
      <div>CPU {[=(v.cpu_limit/10).toFixed(1)]} cores</div>
      <div>RAM {[=inCp.UtilResSizeFormat(v.mem_limit * inCp.ByteMB)]}</div>
    </div>
    {[~]}
  </td>
</tr>


<tr>
  <td>Image</td>
  <td></td>
  <td class="incp-form-box-selector">
    {[~it._images.items :v]}
    <div class="incp-form-box-selector-item {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-box-image-id-{[=valueui.utilx.cryptoMd5(v.meta.id)]}"
      onclick="inOpsPod.SpecPlanSetBoxImageChange('{[=v.meta.id]}')">
      <div>{[? v.meta.name]}{[=v.meta.name]} / {[?]}{[=v.driver]}</div>
      <div>{[=v.meta.id]}</div>
    </div>
    {[~]}
  </td>
</tr>

<tr>
  <td>System Storage</td>
  <td></td>
  <td class="incp-form-box-selector">
    {[~it._resvolumes.items :v]}
    <div class="incp-form-box-selector-item incp-form-box-selector-item-w2 {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-res-volume-id-{[=v.meta.id]}"
      onclick="inOpsPod.SpecPlanSetResVolumeChange('{[=v.meta.id]}')">
      <div>{[=v.meta.name]}</div>
      <div>Range: {[=v.request]} ~ {[=v.limit]} GB</div>
      <div>Default: {[=v.default]} GB{[? v._attrs]}, Attrs: {[=v._attrs]}{[?]}</div>
    </div>
    {[~]}
  </td>
</tr>

<tr>
  <td>Sort Order (0 ~ 10)</td>
  <td></td>
  <td>
    <input type="text" class="form-control" name="plan_sort_order" value="{[=it.sort_order]}">
  </td>
</tr>

<tr>
  <td>Action</td>
  <td></td>
  <td>
  {[~it._statuses :v]}
    <span class="incp-form-checkbox checkbox-inline">
      <input type="radio" name="plan_status" value="{[=v.name]}" {[ if (v._selected) { ]}checked="checked"{[ } ]}> {[=v.value]}
    </span>
  {[~]}
  </td>
</tr>

<tr>
  <td></td>
  <td></td>
  <td>
    <button type="button" class="btn btn-primary" onclick="inOpsPod.SpecPlanSetCommit()">
      Save
    </button>
    <button type="button" class="btn" onclick="inOpsPod.SpecPlanList()" style="margin-left:10px">
      Cancel
    </button>
  </td>
</tr>

</tbody>
</table>

</div>
</div>
</script>

<script type="text/html" id="inops-podspec-planset-label-tpl">
<tr class="inops-podspec-planset-label-item">
  <td>
    <input name="label_name" type="text" value="" class="form-control input-sm" placeholder="Name">
  </td>
  <td>
    <input name="label_value" type="text" value="" class="form-control input-sm" placeholder="Value">
  </td>
  <td align="right">
    <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetLabelDel(this)">
      <i class="fa fa-times"></i>
    </button>
  </td>
</tr>
</script>

<script type="text/html" id="inops-podspec-planset-annotation-tpl">
<tr class="inops-podspec-planset-annotation-item">
  <td>
    <input name="annotation_name" type="text" value="" class="form-control input-sm" placeholder="Name">
  </td>
  <td>
    <input name="annotation_value" type="text" value="" class="form-control input-sm" placeholder="Value">
  </td>
  <td align="right">
    <button class="btn btn-default icon-x20" onclick="inOpsPod.SpecPlanSetAnnotationDel(this)">
      <i class="fa fa-times"></i>
    </button>
  </td>
</tr>
</script>

