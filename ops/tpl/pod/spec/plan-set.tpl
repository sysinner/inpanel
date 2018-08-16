<style>
#inops-podspec-planset .btn-sm {
  padding: 3px 10px;
  font-size: 12px;
  line-height: 100%;
}
</style>
<div id="inops-podspec-planset-alert"></div>

<div id="inops-podspec-planset" class="incp-div-light" style="padding:10px;margin-bottom:20px;">
  <div id="inops-podspec-planset-info"></div>
  <div id="inops-podspec-planset-zone"></div>
  <div id="inops-podspec-planset-rescompute"></div>
  <div id="inops-podspec-planset-image"></div>
  <div id="inops-podspec-planset-resvolume"></div>
  <div>
    <button type="button" class="pure-button pure-button-primary" onclick="inOpsPod.SpecPlanSetCommit()">
      Save
    </button>
    <button type="button" class="pure-button" onclick="inOpsPod.SpecPlanList()" style="margin-left:10px">
      Cancel
    </button>
  </div>
</div>

<script type="text/html" id="inops-podspec-planset-info-tpl">

{[if (!it.meta.id || it.meta.id.length < 1) {]}
<div class="l4i-form-group">
  <label class="">ID</label>
  <div class="">
    <input type="text" class="form-control" name="plan_meta_id" value="">
  </div>
</div>
{[} else {]}
<input type="hidden" name="plan_meta_id" value="{[=it.meta.id]}">
{[}]}

<div class="l4i-form-group">
  <label class="">Name</label>
  <div class="">
    <input type="text" class="form-control" name="plan_meta_name" value="{[=it.meta.name]}">
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Labels</label>
  <button class="btn btn-default btn-sm" onclick="inOpsPod.SpecPlanSetLabelAppend()">
    <img src="/in/cp/~/open-iconic/svg/plus.svg"> &nbsp; Add new Label
  </button>
  <div class="">
    <table class="table table-hover">
      <thead>
        <tr>
          <th width="30%">Name (ex. namespace/module/name, ...)</th>
          <th>Value</th>
          <th width="100px"></th>
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
            <button class="pure-button button-xsmall" onclick="inOpsPod.SpecPlanSetLabelDel(this)">
              Delete
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Annotations</label>
  <button class="btn btn-default btn-sm" onclick="inOpsPod.SpecPlanSetAnnotationAppend()">
    <img src="/in/cp/~/open-iconic/svg/plus.svg"> &nbsp; Add new Annotation
  </button>
  <div class="">
    <table class="table table-hover">
      <thead>
        <tr>
          <th width="30%">Name (ex. namespace/module/name, ...)</th>
          <th>Value</th>
          <th width="100px"></th>
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
            <button class="pure-button button-xsmall" onclick="inOpsPod.SpecPlanSetAnnotationDel(this)">
              Delete
            </button>
          </td>
        </tr>
        {[~]}
      </tbody>
    </table>
  </div>
</div>


<div class="l4i-form-group">
  <label class="">Status</label>
  <div class="">
  {[~it._statuses :v]}
    <span class="incp-form-checkbox checkbox-inline">
      <input type="radio" name="plan_status" value="{[=v.name]}" {[ if (v._selected) { ]}checked="checked"{[ } ]}> {[=v.value]}
    </span>
  {[~]}
  </div>
</div>

<div class="l4i-form-group">
  <label class="">Sort Order (0 ~ 15)</label>
  <div class="">
    <input type="text" class="form-control" name="plan_sort_order" value="{[=it.sort_order]}">
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
    <button class="pure-button button-xsmall" onclick="inOpsPod.SpecPlanSetLabelDel(this)">
      Delete
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
    <button class="pure-button button-xsmall" onclick="inOpsPod.SpecPlanSetAnnotationDel(this)">
      Delete
    </button>
  </td>
</tr>
</script>

<script type="text/html" id="inops-podspec-planset-zone-tpl">
<div class="l4i-form-group">
  <label>Zone / Cluster</label>
  <div class="incp-form-box-selector">
    {[~it.items :v]}
    {[~v.cells :vc]}
    <div class="incp-form-box-selector-item {[if (vc._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-zone-id-{[=v.meta.id]}-{[=vc.meta.id]}"
      onclick="inOpsPod.SpecPlanSetClusterChange('{[=v.meta.id]}', '{[=vc.meta.id]}')">
      <div>{[=v.meta.id]}</div>
      <div>{[=vc.meta.id]}</div>
    </div>
    {[~]}
    {[~]}
  </div>
</div>
</script>


<script type="text/html" id="inops-podspec-planset-rescompute-tpl">
<div class="l4i-form-group">
  <label>CPU and Memory</label>
  <div class="incp-form-box-selector">
    {[~it.items :v]}
    <div class="incp-form-box-selector-item {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-res-compute-id-{[=v.meta.id]}"
      onclick="inOpsPod.SpecPlanSetResComputeChange('{[=v.meta.id]}')">
      <div>CPU: {[=v.cpu_limit]}m</div>
      <div>Memory: {[=inCp.UtilResSizeFormat(v.mem_limit)]}</div>
    </div>
    {[~]}
  </div>
</div>
</script>


<script type="text/html" id="inops-podspec-planset-image-tpl">
<div class="l4i-form-group">
  <label>Image</label>
  <div class="incp-form-box-selector">
    {[~it.items :v]}
    <div class="incp-form-box-selector-item {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-box-image-id-{[=l4iString.CryptoMd5(v.meta.id)]}"
      onclick="inOpsPod.SpecPlanSetBoxImageChange('{[=v.meta.id]}')">
      <div>{[=v.meta.id]}</div>
      <div>{[=v.driver]} / {[=v.os_dist]}</div>
    </div>
    {[~]}
  </div>
</div>
</script>

<script type="text/html" id="inops-podspec-planset-resvolume-tpl">
<div class="l4i-form-group">
  <label>System Storage</label>
  <div class="incp-form-box-selector">
    {[~it.items :v]}
    <div class="incp-form-box-selector-item {[if (v._selected) { ]}selected{[ } ]}" 
      id="inops-podspec-planset-res-volume-id-{[=v.meta.id]}"
      onclick="inOpsPod.SpecPlanSetResVolumeChange('{[=v.meta.id]}')">
      <div>Default: {[=inCp.UtilResSizeFormat(v.default)]}</div>
      <div>Range: {[=inCp.UtilResSizeFormat(v.request)]} ~ {[=inCp.UtilResSizeFormat(v.limit)]}</div>
    </div>
    {[~]}
  </div>
</div>
</script>

